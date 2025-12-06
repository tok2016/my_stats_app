'use client';

import NextImage from 'next/image';
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef
} from 'react';

import Button from '@components/Button';
import { clamp } from '@lib/utils';

type AvatarEditorProps = {
  avatarUrl: string;
  onCancel: () => void;
  saveFile: (file: File) => void;
};

type Direction = 'cen' | 'ne' | 'nw' | 'se' | 'sw';

type ResizeStartState = {
  isMouseDown: boolean;
  mouseX: number;
  mouseY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  topBorder: number;
  bottomBorder: number;
  leftBorder: number;
  rightBorder: number;
  direction?: Direction;
};

type FrameTransform = (
  evt: MouseEvent,
  frame: HTMLElement,
  resizeStart: ResizeStartState
) => void;

const MIN_FRAME_SIZE = 200;

const ProportionCursors: Record<Direction, string> = {
  cen: 'move',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize'
};

const translateFrame =
  (top?: boolean, left?: boolean) =>
  (evt: MouseEvent, frame: HTMLElement, resizeStart: ResizeStartState) => {
    const diff = (evt.pageY - resizeStart.mouseY) * (top ? -1 : 1);
    const newTop = top ? resizeStart.y - diff : frame.offsetTop;
    const newLeft = left ? resizeStart.x - diff : frame.offsetLeft;
    const size = Math.max(resizeStart.height + diff, MIN_FRAME_SIZE);

    if (
      size + newTop > resizeStart.bottomBorder
      || size + newLeft > resizeStart.rightBorder
      || newTop < resizeStart.topBorder
      || newLeft < resizeStart.leftBorder
    ) {
      return;
    }

    frame.style.height = `${size}px`;
    frame.style.width = `${size}px`;

    frame.style.top = `${newTop}px`;
    frame.style.left = `${newLeft}px`;
  };

const TransformFrame: Record<Direction, FrameTransform> = {
  cen: (evt, frame, resizeStart) => {
    const newTop = clamp(
      resizeStart.y + (evt.pageY - resizeStart.mouseY),
      resizeStart.topBorder,
      resizeStart.bottomBorder - resizeStart.height
    );
    const newLeft = clamp(
      resizeStart.x + (evt.pageX - resizeStart.mouseX),
      resizeStart.leftBorder,
      resizeStart.rightBorder - resizeStart.width
    );

    frame.style.top = `${newTop}px`;
    frame.style.left = `${newLeft}px`;
  },
  ne: translateFrame(true),
  nw: translateFrame(true, true),
  se: translateFrame(),
  sw: translateFrame(false, true)
};

export default function AvatarEditor({
  avatarUrl,
  onCancel,
  saveFile
}: AvatarEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const resizeStateRef = useRef<ResizeStartState>({
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    topBorder: 0,
    bottomBorder: 0,
    leftBorder: 0,
    rightBorder: 0
  });

  const onMouseUp = useCallback(() => {
    resizeStateRef.current.isMouseDown = false;
    document.documentElement.style.cursor = 'unset';
    document.removeEventListener('mousemove', onTransform);
  }, []);

  const onTransform = (evt: MouseEvent) => {
    if (
      frameRef.current
      && resizeStateRef.current.isMouseDown
      && resizeStateRef.current.direction
    ) {
      TransformFrame[resizeStateRef.current.direction]?.(
        evt,
        frameRef.current,
        resizeStateRef.current
      );
    }
  };

  const onMouseDown = (evt: ReactMouseEvent) => {
    resizeStateRef.current.isMouseDown = true;
    if (frameRef.current && imageRef.current) {
      frameRef.current.style.minHeight = `${MIN_FRAME_SIZE}px`;
      frameRef.current.style.minWidth = `${MIN_FRAME_SIZE}px`;

      resizeStateRef.current.mouseX = evt.pageX;
      resizeStateRef.current.mouseY = evt.pageY;

      resizeStateRef.current.x = frameRef.current.offsetLeft;
      resizeStateRef.current.y = frameRef.current.offsetTop;
      resizeStateRef.current.width = frameRef.current.offsetWidth;
      resizeStateRef.current.height = frameRef.current.offsetHeight;

      const { top, bottom, left, right } =
        imageRef.current.getBoundingClientRect();
      resizeStateRef.current.topBorder = Math.ceil(top);
      resizeStateRef.current.bottomBorder = Math.ceil(bottom);
      resizeStateRef.current.leftBorder = Math.ceil(left);
      resizeStateRef.current.rightBorder = Math.ceil(right);

      const direction = (evt.target as HTMLElement)?.id as Direction;

      resizeStateRef.current.direction = direction;
      document.documentElement.style.cursor =
        ProportionCursors[direction] ?? 'unset';

      document.addEventListener('mousemove', onTransform);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseleave', onMouseUp);
    }
  };

  const onSave = async () => {
    if (canvasRef.current && frameRef.current && imageRef.current) {
      const { top, left, height, width } =
        frameRef.current.getBoundingClientRect();

      const {
        top: imgTop,
        left: imgLeft,
        width: imgWidth,
        height: imgHeight
      } = imageRef.current.getBoundingClientRect();
      const hProption = imageRef.current.naturalHeight / imgHeight;
      const wProportion = imageRef.current.naturalWidth / imgWidth;

      canvasRef.current.height = height;
      canvasRef.current.width = width;

      canvasRef.current
        .getContext('2d')
        ?.drawImage(
          imageRef.current,
          (left - imgLeft) * wProportion,
          (top - imgTop) * hProption,
          width * wProportion,
          height * hProption,
          0,
          0,
          width,
          height
        );

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], Date.now().toString(), {
            type: 'image/png'
          });

          saveFile(file);
        }
      }, 'image/png');
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseUp);
    };
  }, [avatarUrl, onMouseUp]);

  return (
    <div className='avatar-editor'>
      <div className='avatar-origin'>
        <NextImage
          src={avatarUrl}
          alt=''
          ref={imageRef}
          width={1000}
          height={1000}
          priority
        />

        <div
          ref={frameRef}
          className='frame'
          id='cen'
          onMouseDown={onMouseDown}
        >
          <div id='ne'></div>
          <div id='se'></div>
          <div id='sw'></div>
          <div id='nw'></div>
        </div>
      </div>

      <canvas ref={canvasRef} hidden></canvas>

      <div className='buttons-flex-box'>
        <Button onClick={onSave} type='button'>
          Save
        </Button>
        <Button onClick={onCancel} type='button' variant='secondary'>
          Cancel
        </Button>
      </div>
    </div>
  );
}
