'use client';
import * as React from 'react';

export function Hello({ name = 'World' }: { name?: string }) {
  return <h1>Hello, {name}!</h1>;
}
