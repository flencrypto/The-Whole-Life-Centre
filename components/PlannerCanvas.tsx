'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Transformer } from 'react-konva';
import Konva from 'konva';
import { useStore } from '@/lib/store';
import { Facility } from '@/lib/types';
import { ZONE_COLORS } from '@/lib/facilityTypes';

const CANVAS_W = 1200;
const CANVAS_H = 800;
const GRID_SIZE = 40;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function GridLines({ width, height }: { width: number; height: number }) {
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= width; x += GRID_SIZE) {
    lines.push(
      <Line key={`v${x}`} points={[x, 0, x, height]} stroke="#d1d5db" strokeWidth={0.5} />
    );
  }
  for (let y = 0; y <= height; y += GRID_SIZE) {
    lines.push(
      <Line key={`h${y}`} points={[0, y, width, y]} stroke="#d1d5db" strokeWidth={0.5} />
    );
  }
  return <>{lines}</>;
}

function FacilityShape({
  facility,
  isSelected,
  showLabel,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: {
  facility: Facility;
  isSelected: boolean;
  showLabel: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (attrs: Partial<Facility>) => void;
}) {
  const rectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const fillColor = facility.color ?? ZONE_COLORS[facility.zone] ?? '#aaa';
  const strokeColor = isSelected ? '#1d4ed8' : hexToRgba(fillColor, 0.6);

  return (
    <>
      <Group
        ref={groupRef}
        x={facility.x}
        y={facility.y}
        rotation={facility.rotation}
        draggable={!facility.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onTransformEnd({
            x: node.x(),
            y: node.y(),
            width: Math.max(20, facility.width * scaleX),
            height: Math.max(20, facility.height * scaleY),
            rotation: node.rotation(),
          });
        }}
      >
        <Rect
          ref={rectRef}
          width={facility.width}
          height={facility.height}
          fill={hexToRgba(fillColor, 0.75)}
          stroke={strokeColor}
          strokeWidth={isSelected ? 2 : 1}
          cornerRadius={4}
          shadowEnabled={isSelected}
          shadowColor="#1d4ed8"
          shadowBlur={8}
          shadowOpacity={0.3}
        />
        {showLabel && (
          <Text
            text={facility.name}
            width={facility.width}
            height={facility.height}
            align="center"
            verticalAlign="middle"
            fontSize={Math.max(8, Math.min(12, facility.width / 7))}
            fontFamily="system-ui, sans-serif"
            fill="#1c1917"
            padding={4}
            wrap="word"
          />
        )}
        {facility.locked && (
          <Text
            text="🔒"
            x={facility.width - 14}
            y={2}
            fontSize={10}
          />
        )}
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
          borderStroke="#1d4ed8"
          anchorFill="#fff"
          anchorStroke="#1d4ed8"
        />
      )}
    </>
  );
}

function NorthArrow() {
  return (
    <Group x={CANVAS_W - 50} y={30}>
      <Rect width={36} height={36} fill="rgba(255,255,255,0.85)" cornerRadius={18} />
      <Text text="N" x={0} y={6} width={36} align="center" fontSize={11} fontStyle="bold" fill="#1c1917" />
      <Text text="↑" x={0} y={18} width={36} align="center" fontSize={13} fill="#1d4ed8" />
    </Group>
  );
}

export default function PlannerCanvas() {
  const project = useStore((s) =>
    s.projects.find((p) => p.projectId === s.currentProjectId) ?? null
  );
  const selectedFacilityId = useStore((s) => s.selectedFacilityId);
  const selectFacility = useStore((s) => s.selectFacility);
  const updateFacility = useStore((s) => s.updateFacility);
  const showGrid = useStore((s) => s.showGrid);
  const showLabels = useStore((s) => s.showLabels);
  const visibleLayers = useStore((s) => s.visibleLayers);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setStageSize({ width, height });
        // Fit canvas in container initially
        const fitScale = Math.min(width / CANVAS_W, height / CANVAS_H) * 0.9;
        setScale(fitScale);
        setPosition({
          x: (width - CANVAS_W * fitScale) / 2,
          y: (height - CANVAS_H * fitScale) / 2,
        });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1.08;
    const newScale = Math.min(3, Math.max(0.2, oldScale * (direction > 0 ? factor : 1 / factor)));
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };
    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, [scale, position]);

  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() || e.target.name() === 'bg') {
      selectFacility(null);
      isDragging.current = true;
      lastPointer.current = { x: e.evt.clientX, y: e.evt.clientY };
    }
  }, [selectFacility]);

  const handleStageMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragging.current) return;
    const dx = e.evt.clientX - lastPointer.current.x;
    const dy = e.evt.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.evt.clientX, y: e.evt.clientY };
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleStageMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (!project) return null;

  return (
    <div ref={containerRef} className="flex-1 bg-stone-100 overflow-hidden relative">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        style={{ cursor: isDragging.current ? 'grabbing' : 'default' }}
      >
        <Layer>
          {/* Site background */}
          <Rect
            name="bg"
            x={0}
            y={0}
            width={CANVAS_W}
            height={CANVAS_H}
            fill="#f5f0e8"
            stroke="#d6d0c4"
            strokeWidth={2}
          />
          {/* Grid */}
          {showGrid && <GridLines width={CANVAS_W} height={CANVAS_H} />}
        </Layer>

        <Layer>
          {/* Facilities layer — hidden when 'buildings' layer is toggled off */}
          {visibleLayers.includes('buildings') && project.facilities.map((facility) => (
            <FacilityShape
              key={facility.id}
              facility={facility}
              isSelected={selectedFacilityId === facility.id}
              showLabel={showLabels && visibleLayers.includes('labels')}
              onSelect={() => selectFacility(facility.id)}
              onDragEnd={(x, y) => updateFacility(facility.id, { x, y })}
              onTransformEnd={(attrs) => updateFacility(facility.id, attrs)}
            />
          ))}
        </Layer>

        <Layer>
          <NorthArrow />
        </Layer>
      </Stage>

      {/* Zoom controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          onClick={() => setScale((s) => Math.min(3, s * 1.2))}
          className="w-8 h-8 bg-white border border-stone-300 rounded-md shadow text-stone-600 hover:bg-stone-50 text-lg flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.2, s / 1.2))}
          className="w-8 h-8 bg-white border border-stone-300 rounded-md shadow text-stone-600 hover:bg-stone-50 text-lg flex items-center justify-center"
        >
          −
        </button>
        <button
          onClick={() => {
            const fitScale = Math.min(stageSize.width / CANVAS_W, stageSize.height / CANVAS_H) * 0.9;
            setScale(fitScale);
            setPosition({
              x: (stageSize.width - CANVAS_W * fitScale) / 2,
              y: (stageSize.height - CANVAS_H * fitScale) / 2,
            });
          }}
          className="w-8 h-8 bg-white border border-stone-300 rounded-md shadow text-stone-500 hover:bg-stone-50 text-xs flex items-center justify-center font-medium"
          title="Fit to screen"
        >
          ⊡
        </button>
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-stone-400 bg-white/70 px-2 py-1 rounded-md">
        {Math.round(scale * 100)}% · {project.facilities.length} facilities
      </div>
    </div>
  );
}
