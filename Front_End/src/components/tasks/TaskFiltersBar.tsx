import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import type { TaskStatus, TaskPriority, TaskQueryDTO } from '../../types/task';

interface TaskFiltersBarProps {
  filters: TaskQueryDTO;
  onFilterChange: (newFilters: Partial<TaskQueryDTO>) => void;
  onResetFilters: () => void;
  viewMode: 'list' | 'kanban';
  onViewModeChange: (mode: 'list' | 'kanban') => void;
}

export const TaskFiltersBar: React.FC<TaskFiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({ search: searchTerm, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFilterChange]);

  // Sync state if filters reset externally
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        mb: 3,
        p: 2,
        backgroundColor: 'rgba(17, 24, 39, 0.6)',
        backdropFilter: 'blur(8px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Search Input */}
      <TextField
        placeholder="Search tasks by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ minWidth: { md: 280 }, flexGrow: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <ClearIcon
                  fontSize="small"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearchTerm('');
                    onFilterChange({ search: '', page: 1 });
                  }}
                />
              </InputAdornment>
            ) : null,
          },
        }}
      />

      {/* Filter Selectors & Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) => onFilterChange({ status: e.target.value as TaskStatus | '', page: 1 })}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            label="Priority"
            onChange={(e) => onFilterChange({ priority: e.target.value as TaskPriority | '', page: 1 })}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        {(filters.search || filters.status || filters.priority) && (
          <Button size="small" color="inherit" onClick={onResetFilters}>
            Reset
          </Button>
        )}

        {/* View Mode Toggle Button */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_e, newMode) => newMode && onViewModeChange(newMode)}
          size="small"
          color="primary"
        >
          <ToggleButton value="list">
            <Tooltip title="List View">
              <ViewListIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="kanban">
            <Tooltip title="Kanban Board View">
              <ViewKanbanIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
