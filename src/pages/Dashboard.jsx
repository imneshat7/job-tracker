import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-bold">Job Tracker</div>
                <div className="flex items-center space-x-4">
                    <span>Welcome, {user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    My Applications
                </h2>
                <p className="text-gray-500">No applications yet. Add one!</p>
            </main>
        </div>
    );
}
