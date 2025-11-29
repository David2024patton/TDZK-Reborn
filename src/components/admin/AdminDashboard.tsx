
import React from 'react';
import { useGame } from '../../context/GameContext';

export const AdminDashboard: React.FC = () => {
    const { gameState, togglePause, randomizeRound, player } = useGame();

    if (!player.isAdmin) {
        return (
            <div className="flex items-center justify-center h-full text-red-500 font-bold text-xl">
                ACCESS DENIED
            </div>
        );
    }

    return (
        <div className="p-8 text-[#cccccc] font-verdana max-w-2xl mx-auto">
            <h1 className="text-2xl text-[#00ccff] font-bold mb-6 border-b border-[#004488] pb-2">
                Administration Console
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Game State Control */}
                <div className="bg-[#001122] border border-[#223344] p-4 rounded shadow-lg">
                    <h2 className="text-white font-bold mb-4">Game State</h2>

                    <div className="flex items-center justify-between mb-4">
                        <span>Status:</span>
                        <span className={`font-bold ${gameState.isPaused ? 'text-red-500' : 'text-green-500'}`}>
                            {gameState.isPaused ? 'PAUSED' : 'RUNNING'}
                        </span>
                    </div>

                    <button
                        onClick={togglePause}
                        className={`w-full py-2 px-4 rounded font-bold transition-colors ${gameState.isPaused
                                ? 'bg-green-700 hover:bg-green-600 text-white'
                                : 'bg-red-700 hover:bg-red-600 text-white'
                            }`}
                    >
                        {gameState.isPaused ? 'RESUME GAME' : 'PAUSE GAME'}
                    </button>
                </div>

                {/* Universe Control */}
                <div className="bg-[#001122] border border-[#223344] p-4 rounded shadow-lg">
                    <h2 className="text-white font-bold mb-4">Universe Control</h2>

                    <div className="mb-4 text-xs text-gray-400">
                        Current Round ID: <span className="text-mono text-white">{gameState.roundId}</span>
                    </div>

                    <p className="text-xs mb-4 text-yellow-500">
                        Warning: Randomizing the round will shuffle system locations and reset connections.
                    </p>

                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to randomize the universe? This cannot be undone.")) {
                                randomizeRound();
                            }
                        }}
                        className="w-full py-2 px-4 bg-[#442200] hover:bg-[#663300] border border-[#884400] text-[#ffaa00] rounded font-bold transition-colors"
                    >
                        RANDOMIZE UNIVERSE
                    </button>
                </div>
            </div>
        </div>
    );
};
