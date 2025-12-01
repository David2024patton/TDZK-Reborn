import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SYSTEMS, SystemNode } from '../data/universe';

interface PlayerState {
    username: string;
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
    currentSectorData: any;
    moveSector: (targetSector: string) => void;
    warpSystem: (targetSystemId: string) => void;
    togglePause: () => void;
    randomizeRound: () => void;
    setAdmin: (isAdmin: boolean) => void;
    login: (username: string, isAdmin: boolean) => void;
    logout: () => void;
    message: string | null;
    addMessage: (msg: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initial State
    const [player, setPlayer] = useState<PlayerState>({
        username: '',
        currentSector: '0',
        currentSystem: '0',
        turns: 0,
        isAdmin: false,
        credits: 0,
        score: 0
    });

    const [gameState, setGameState] = useState<GameState>({
        isPaused: false,
        roundId: 'alpha-1',
        lastTick: Date.now()
    });

    const [systems, setSystems] = useState<SystemNode[]>([]);

    const [currentSectorData, setCurrentSectorData] = useState<any>(null);

    const [message, setMessage] = useState<string | null>(null);
    const messageTimer = useRef<NodeJS.Timeout | null>(null);

    // Fetch Initial Data
    useEffect(() => {
        // Fetch Systems
        fetch('/api/systems')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => setSystems(data))
            .catch(err => {
                console.error("Failed to fetch systems:", err);
                setSystems([]); // Fallback to empty array
            });
    }, []);

    // Fetch Sector Data when currentSector changes
    useEffect(() => {
        if (!player.currentSector || player.currentSector === '0') return;
        fetch(`/api/sector/${player.currentSector}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!data.error) setCurrentSectorData(data);
            })
            .catch(err => console.error("Failed to fetch sector data:", err));
    }, [player.currentSector]);

    const addMessage = (msg: string) => {
        if (messageTimer.current) clearTimeout(messageTimer.current);
        setMessage(msg);
        messageTimer.current = setTimeout(() => setMessage(null), 8000);
    };

    const clearMessages = () => {
        if (messageTimer.current) clearTimeout(messageTimer.current);
        setMessage(null);
    };

    // Actions
    const moveSector = async (targetSector: string) => {
        if (gameState.isPaused && !player.isAdmin) return;
        if (player.turns <= 0 && !player.isAdmin) return;

        try {
            const res = await fetch('/api/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: player.username, targetSectorNumber: parseInt(targetSector) })
            });
            const data = await res.json();

            if (data.success) {
                setPlayer(prev => ({
                    ...prev,
                    currentSector: targetSector,
                    turns: prev.turns // Backend should update turns, but we need to refetch or decrement locally
                }));
                addMessage(`Moved to Sector ${targetSector}`);
                // Ideally refetch player state here
            } else {
                console.error("Move failed:", data.error);
                let errorMsg = data.error;
                if (errorMsg.includes('Sector does not exist')) {
                    errorMsg = 'Sector does not exist';
                }
                addMessage(`Move failed: ${errorMsg}`);
            }
        } catch (err) {
            console.error("Move error:", err);
            addMessage("Move error");
        }
    };

    const warpSystem = async (targetSystemId: string) => {
        if (gameState.isPaused && !player.isAdmin) return;

        try {
            const res = await fetch('/api/warp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: player.username, targetSystemId: parseInt(targetSystemId) })
            });
            const data = await res.json();

            if (data.success) {
                setPlayer(prev => ({
                    ...prev,
                    currentSystem: targetSystemId,
                    currentSector: data.currentSector.toString(),
                    turns: prev.turns - 10
                }));
                addMessage(`Warped to System ${targetSystemId}`);
            } else {
                console.error("Warp failed:", data.error);
                addMessage(`Warp failed: ${data.error}`);
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

    // Check for persistent session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) {
            try {
                const { username, isAdmin } = JSON.parse(savedUser);
                login(username, isAdmin);
            } catch (e) {
                console.error("Failed to parse session", e);
                localStorage.removeItem('user_session');
            }
        }
    }, []);

    const login = (username: string, isAdmin: boolean) => {
        // Save session
        localStorage.setItem('user_session', JSON.stringify({ username, isAdmin }));

        setPlayer(prev => ({
            ...prev,
            username,
            isAdmin
        }));
        // Optionally fetch full player data here
        fetch(`/api/player/${username}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setPlayer(prev => ({
                        ...prev,
                        currentSector: data.current_sector_number?.toString() || '0',
                        currentSystem: data.current_system_id?.toString() || '0',
                        turns: data.turns,
                        credits: parseInt(data.credits_on_hand),
                        score: data.score
                    }));
                }
            })
            .catch(err => console.error("Failed to fetch player data on login:", err));
    };

    const logout = () => {
        localStorage.removeItem('user_session');
        setPlayer({
            username: '',
            currentSector: '0',
            currentSystem: '0',
            turns: 0,
            isAdmin: false,
            credits: 0,
            score: 0
        });
    };

    return (
        <GameContext.Provider value={{
            player,
            gameState,
            systems,
            currentSectorData,
            moveSector,
            warpSystem,
            togglePause,
            randomizeRound,
            setAdmin,
            login,
            logout,
            message,
            addMessage
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
