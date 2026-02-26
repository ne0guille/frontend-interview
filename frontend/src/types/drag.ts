import { DragEventHandler } from 'react';

export type DragProps = {
  draggable: true;
  onDragStart: DragEventHandler;
  onDragOver: DragEventHandler;
  onDrop: DragEventHandler;
  onDragEnd: DragEventHandler;
};
