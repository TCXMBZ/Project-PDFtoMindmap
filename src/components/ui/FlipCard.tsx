/*
 * From Uiverse.io by vamsidevendrakumar - https://uiverse.io/vamsidevendrakumar/soft-shrimp-94
 * MIT License, Copyright (c) vamsidevendrakumar (Vamsi Devendra Kumar)
 */

'use client';

import React from 'react';
import styles from './FlipCard.module.css';

interface FlipCardProps {
  front?: React.ReactNode;
  back?: React.ReactNode;
  className?: string;
}

export default function FlipCard({
  front = <p>Front Side</p>,
  back = <p>Back Side</p>,
  className = '',
}: FlipCardProps) {
  return (
    <div className={`${styles.card} ${className}`.trim()} tabIndex={0}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>{front}</div>
        <div className={styles.cardBack}>{back}</div>
      </div>
    </div>
  );
}
