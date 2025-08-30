import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLogger } from '../hooks/useLogger';

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
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getLogClass = (type) => {
    const baseClass = 'text-sm p-2 rounded border-l-4';
    switch (type) {
      case 'success': return `${baseClass} log-success border-green-500 bg-green-50`;
      case 'error': return `${baseClass} log-error border-red-500 bg-red-50`;
      case 'warning': return `${baseClass} log-warning border-orange-500 bg-orange-50`;
      default: return `${baseClass} log-info border-blue-500 bg-blue-50`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
        <button
          onClick={clearLogs}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-2">
          {state.logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm">Activity logs will appear here</p>
              </div>
            </div>
          ) : (
            state.logs.map((log) => (
              <div key={log.id} className={getLogClass(log.type)}>
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 text-xs mt-0.5">
                    {getLogIcon(log.type)}
                  </span>
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
        </div>
      </div>
      
      {/* Log Stats */}
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>{state.logs.length} entries</span>
        <span>
          {state.logs.filter(log => log.type === 'error').length > 0 && 
            `${state.logs.filter(log => log.type === 'error').length} errors`}
        </span>
      </div>
    </div>
  );
};

export default ActivityLog;