import React, { createContext, useContext, useState, useEffect } from 'react';
import { SYSTEMS, SystemNode } from '../data/universe';

interface PlayerState {
    currentSector: string;
    currentSystem: string;
    turns: number;
    isAdmin: boolean;
    credits: number;
    score: number;
}

interface GameState {
    isPaused: boolean;
    roundId: string;
    lastTick: number;
}

interface GameContextType {
    player: PlayerState;
    gameState: GameState;
    systems: SystemNode[];
    moveSector: (targetSector: string) => void;
    warpSystem: (targetSystemId: string) => void;
    togglePause: () => void;
    randomizeRound: () => void;
    setAdmin: (isAdmin: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initial State
    const [player, setPlayer] = useState<PlayerState>({
        currentSector: '11199',
        currentSystem: '11',
        turns: 1000,
        isAdmin: false,
        credits: 1000,
        score: 0
    });

    const [gameState, setGameState] = useState<GameState>({
        isPaused: false,
        roundId: 'alpha-1',
        lastTick: Date.now()
    });

    const [systems, setSystems] = useState<SystemNode[]>([]);

    // Fetch Initial Data
    useEffect(() => {
        // Fetch Systems
        fetch('/api/systems')
            .then(res => res.json())
            .then(data => setSystems(data))
            .catch(err => console.error("Failed to fetch systems:", err));

        // Fetch Player (hardcoded 'admin' for now)
        fetch('/api/player/admin')
            .then(res => res.json())
            .then(data => {
                if (data.error) return;
                setPlayer({
                    currentSector: data.current_sector_number?.toString() || '0',
                    currentSystem: data.current_system_id?.toString() || '0',
                    turns: data.turns,
                    isAdmin: data.is_admin,
                    credits: parseInt(data.credits_on_hand),
                    score: data.score
                });
            })
            .catch(err => console.error("Failed to fetch player:", err));
    }, []);

    // Actions
    // Actions
    const moveSector = async (targetSector: string) => {
        if (gameState.isPaused && !player.isAdmin) return;
        if (player.turns <= 0 && !player.isAdmin) return;

        try {
            const res = await fetch('/api/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', targetSectorNumber: parseInt(targetSector) })
            });
            const data = await res.json();

            if (data.success) {
                setPlayer(prev => ({
                    ...prev,
                    currentSector: targetSector,
                    turns: prev.turns // Backend should update turns, but we need to refetch or decrement locally
                }));
                // Ideally refetch player state here
            } else {
                console.error("Move failed:", data.error);
            }
        } catch (err) {
            console.error("Move error:", err);
        }
    };

    const warpSystem = async (targetSystemId: string) => {
        if (gameState.isPaused && !player.isAdmin) return;

        try {
            const res = await fetch('/api/warp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', targetSystemId: parseInt(targetSystemId) })
            });
            const data = await res.json();

            if (data.success) {
                setPlayer(prev => ({
                    ...prev,
                    currentSystem: targetSystemId,
                    currentSector: data.currentSector.toString(),
                    turns: prev.turns - 10
                }));
            } else {
                console.error("Warp failed:", data.error);
            }
        } catch (err) {
            console.error("Warp error:", err);
        }
    };

    const togglePause = () => {
        if (!player.isAdmin) return;
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    };

    const randomizeRound = () => {
        if (!player.isAdmin) return;
        const newRoundId = Math.random().toString(36).substring(7);
        setGameState(prev => ({ ...prev, roundId: newRoundId, lastTick: Date.now() }));
        alert(`Round Randomized! New Round ID: ${newRoundId}`);
    };

    const setAdmin = (isAdmin: boolean) => {
        setPlayer(prev => ({ ...prev, isAdmin }));
    };

    return (
        <GameContext.Provider value={{
            player,
            gameState,
            systems,
            moveSector,
            warpSystem,
            togglePause,
            randomizeRound,
            setAdmin
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
