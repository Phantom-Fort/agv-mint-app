import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLogger } from '../hooks/useLogger';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const ActivityLog = () => {
  const { state } = useApp();
  const { clearLogs } = useLogger();
  const logEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  const getLogClass = (type) => {
    const baseClass = 'text-sm p-2 rounded border-l-4';
    switch (type) {
      case 'success': return `${baseClass} border-green-500 bg-green-50`;
      case 'error': return `${baseClass} border-red-500 bg-red-50`;
      case 'warning': return `${baseClass} border-orange-500 bg-orange-50`;
      default: return `${baseClass} border-blue-500 bg-blue-50`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Radix AlertDialog for Clear */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
        
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Clear
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
            <AlertDialog.Content className="bg-white p-6 rounded-xl shadow-lg max-w-sm mx-auto">
              <AlertDialog.Title className="text-lg font-semibold">
                Clear Activity Log?
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </AlertDialog.Description>
              <div className="mt-4 flex justify-end space-x-3">
                <AlertDialog.Cancel asChild>
                  <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    onClick={clearLogs}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Confirm
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>

      {/* Radix ScrollArea for logs */}
      <ScrollArea.Root className="flex-1 bg-gray-50 rounded-lg p-4">
        <ScrollArea.Viewport className="h-full space-y-2">
          {state.logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  <img
                    src="https://img.icons8.com/?size=100&id=12611&format=png&color=000000"
                    alt="Activity Log Icon"
                  />
                </div>
                <p className="text-sm">Activity logs will appear here</p>
              </div>
            </div>
          ) : (
            state.logs.map((log) => (
              <div key={log.id} className={getLogClass(log.type)}>
                <div className="flex items-start space-x-2">
                  {/* Tooltip around log icon */}
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span className="flex-shrink-0 text-xs mt-0.5 cursor-help">
                          {getLogIcon(log.type)}
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        className="bg-black text-white px-2 py-1 rounded text-xs"
                        side="top"
                      >
                        {log.type.toUpperCase()}
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 break-words">{log.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-gray-200 rounded"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Log Stats */}
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>{state.logs.length} entries</span>
        <span>
          {state.logs.filter((log) => log.type === 'error').length > 0 &&
            `${state.logs.filter((log) => log.type === 'error').length} errors`}
        </span>
      </div>
    </div>
  );
};

export default ActivityLog;
