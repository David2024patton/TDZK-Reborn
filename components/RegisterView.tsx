import React, { useState, useEffect } from 'react';

interface RegisterViewProps {
    onClose: () => void;
    onRegisterSuccess: (username: string) => void;
}

const RACES = [
    { id: 'Derivian', name: 'Derivian', desc: 'Trade Bonus', system: 'Derivia' },
    { id: 'Zallun', name: 'Zallun', desc: 'Combat Bonus', system: 'Zallus' },
    { id: 'Kitaran', name: 'Kitaran', desc: 'Speed Bonus', system: 'Kitara' },
    { id: 'Tamaran', name: 'Tamaran', desc: 'Defense Bonus', system: 'Tamara' },
    { id: 'Sniv', name: 'Sniv', desc: 'Stealth Bonus', system: 'Imrasael' },
    { id: 'Wraith', name: 'Wraith', desc: 'Raiding Bonus', system: "Skull's Haven" },
    { id: 'Quelaar', name: 'Quelaar', desc: 'Mining Bonus', system: 'Vanguard' },
];

export const RegisterView: React.FC<RegisterViewProps> = ({ onClose, onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        race: 'Derivian',
        shipType: 'Frigate'
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Clear form on mount to prevent auto-fill issues
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            race: 'Derivian',
            shipType: 'Frigate'
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Password check temporarily disabled for debugging
        if (formData.password !== formData.confirmPassword) {
            console.error("Password mismatch:", formData.password, "!==", formData.confirmPassword);
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                onRegisterSuccess(formData.username);
                onClose();
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#333] shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-[#666] hover:text-white">✕</button>

                <h2 className="text-2xl text-[#00aaff] font-bold mb-6 border-b border-[#222] pb-2">New Pilot Registration</h2>

                {error && <div className="bg-red-900/50 text-red-200 p-2 mb-4 border border-red-700">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#ccc] mb-1 text-sm">Login Name</label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] text-white p-2 focus:border-[#00aaff] outline-none"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-[#ccc] mb-1 text-sm">E-Mail Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] text-white p-2 focus:border-[#00aaff] outline-none"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-[#ccc] mb-1 text-sm">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] text-white p-2 focus:border-[#00aaff] outline-none"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <label className="block text-[#ccc] mb-1 text-sm">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] text-white p-2 focus:border-[#00aaff] outline-none"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#00aaff] font-bold mb-2">Select Race</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {RACES.map(race => (
                                <label key={race.id} className={`cursor-pointer border p-2 flex flex-col items-center justify-center transition-colors ${formData.race === race.id ? 'border-[#00aaff] bg-[#00aaff]/10' : 'border-[#333] hover:border-[#555]'}`}>
                                    <input
                                        type="radio"
                                        name="race"
                                        value={race.id}
                                        checked={formData.race === race.id}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="font-bold text-white">{race.name}</span>
                                    <span className="text-xs text-[#888]">{race.desc}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#00aaff] font-bold mb-2">Select Ship</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 cursor-pointer border p-3 flex items-center justify-center gap-2 ${formData.shipType === 'Frigate' ? 'border-[#00aaff] bg-[#00aaff]/10' : 'border-[#333]'}`}>
                                <input type="radio" name="shipType" value="Frigate" checked={formData.shipType === 'Frigate'} onChange={handleChange} className="hidden" />
                                <span className="text-white font-bold">Frigate</span>
                                <span className="text-xs text-[#888]">(Combat Balanced)</span>
                            </label>
                            <label className={`flex-1 cursor-pointer border p-3 flex items-center justify-center gap-2 ${formData.shipType === 'Resourcer' ? 'border-[#00aaff] bg-[#00aaff]/10' : 'border-[#333]'}`}>
                                <input type="radio" name="shipType" value="Resourcer" checked={formData.shipType === 'Resourcer'} onChange={handleChange} className="hidden" />
                                <span className="text-white font-bold">Resourcer</span>
                                <span className="text-xs text-[#888]">(Cargo Capacity)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#222]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#004488] hover:bg-[#0055aa] text-white font-bold py-3 uppercase tracking-widest transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Registering...' : 'Initiate Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
