/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimateProps {
  children: React.ReactNode;
  delay?: number; // millisecond delay before showing (e.g. 100, 200)
  duration?: number; // duration in milliseconds (e.g. 500, 700, 1000)
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: 'sm' | 'md' | 'lg'; // offset distance: sm=20px, md=40px, lg=80px
  scale?: boolean; // slight zoom-in scale effect
  threshold?: number; // viewport coverage score ratio (default: 0.1)
  margin?: string; // root bounds offset (default: '0px 0px -80px 0px')
  once?: boolean; // whether animation should fire only once (default: true)
  className?: string; // auxiliary element style additions
  id?: string; // unique identifier
}

export const ScrollAnimate: React.FC<ScrollAnimateProps> = ({
  children,
  delay = 0,
  duration = 700,
  direction = 'up',
  distance = 'md',
  scale = false,
  threshold = 0.08,
  margin = '0px 0px -80px 0px',
  once = true,
  className = '',
  id
}) => {
  const [hasEntered, setHasEntered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check pre-existing preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          if (once && observer) {
            observer.unobserve(element);
          }
        } else if (!once) {
          // Reset states if animation can happen multiple times on scrolling up/down
          setHasEntered(false);
        }
      },
      {
        threshold,
        rootMargin: margin,
      }
    );

    observer.observe(element);

    return () => {
      if (element && observer) {
        observer.unobserve(element);
      }
    };
  }, [threshold, margin, once]);

  // Translate configuration into specific transition styles and initial transform positions
  const getTransformClass = () => {
    if (hasEntered) return 'translate-x-0 translate-y-0 scale-100 opacity-100';

    const scaleStyle = scale ? 'scale-[0.96]' : 'scale-100';
    let directionStyle = '';

    if (direction !== 'none') {
      const distPx = distance === 'sm' ? '20px' : distance === 'lg' ? '60px' : '36px';
      switch (direction) {
        case 'up':
          directionStyle = `translate-y-[${distPx}]`;
          break;
        case 'down':
          directionStyle = `translate-y-[-${distPx}]`;
          break;
        case 'left':
          directionStyle = `translate-x-[${distPx}]`;
          break;
        case 'right':
          directionStyle = `translate-x-[-${distPx}]`;
          break;
      }
    }

    return `opacity-0 ${scaleStyle} ${directionStyle}`;
  };

  const getCustomStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth high-end easeOutEspresso curve
    };
    return styles;
  };

  // Convert distance and direction offset rules to direct CSS variables in case arbitrary translates are compiled dynamically
  const getInlineTransforms = (): React.CSSProperties => {
    if (hasEntered) {
      return {
        transform: 'none',
        opacity: 1
      };
    }

    const distVal = distance === 'sm' ? '20px' : distance === 'lg' ? '60px' : '40px';
    let transformStr = '';
    
    if (scale) {
      transformStr += 'scale(0.96) ';
    }

    switch (direction) {
      case 'up':
        transformStr += `translate3d(0, ${distVal}, 0)`;
        break;
      case 'down':
        transformStr += `translate3d(0, -${distVal}, 0)`;
        break;
      case 'left':
        transformStr += `translate3d(${distVal}, 0, 0)`;
        break;
      case 'right':
        transformStr += `translate3d(-${distVal}, 0, 0)`;
        break;
    }

    return {
      opacity: 0,
      transform: transformStr || undefined
    };
  };

  return (
    <div
      ref={elementRef}
      id={id}
      style={{
        ...getCustomStyles(),
        ...getInlineTransforms()
      }}
      className={`transition-all ${className}`}
    >
      {children}
    </div>
  );
};
