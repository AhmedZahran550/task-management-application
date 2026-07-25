import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Badge } from '@mui/material';
import type { ITask, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: ITask[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onDeleteAttachment?: (taskId: string, publicId: string) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'To Do', title: 'To Do', color: '#f59e0b' },
  { id: 'In Progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'Done', title: 'Done', color: '#10b981' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskStatusChange,
  onEdit,
  onDelete,
  onDeleteAttachment,
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    onTaskStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    p: 2,
                    minHeight: 500,
                    backgroundColor: snapshot.isDraggingOver
                      ? 'rgba(99, 102, 241, 0.08)'
                      : 'rgba(17, 24, 39, 0.5)',
                    borderTop: `4px solid ${column.color}`,
                    borderRadius: 3,
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      {column.title}
                    </Typography>
                    <Badge
                      badgeContent={columnTasks.length}
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { backgroundColor: column.color, fontWeight: 700 } }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {columnTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(providedDrag, snapshotDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            {...providedDrag.dragHandleProps}
                            style={{
                              ...providedDrag.draggableProps.style,
                              opacity: snapshotDrag.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onDeleteAttachment={onDeleteAttachment}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                </Paper>
              )}
            </Droppable>
          );
        })}
      </Box>
    </DragDropContext>
  );
};
