import { useAuth } from '../context/AuthContext.js'
import { supabase } from '../lib/supabase.js'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AddApplicationModal from '../components/AddApplicationModal.js'

interface Application {
    id: string;
    user_id: string;
    company: string;
    role: string;
    status: string;
    notes: string | null;
    created_at: string;
}

const statusColors: Record<string, string> = {
    Applied: 'bg-blue-100 text-blue-700',
    Interview: 'bg-yellow-100 text-yellow-700',
    Offer: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
}

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [applications, setApplications] = useState<Application[]>([])
    const [showModal, setShowModal] = useState(false)
    const [filter, setFilter] = useState('All')

    async function fetchApplications() {
        const { data } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false })
        setApplications(data || [])
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        navigate('/login')
    }

    async function handleDelete(id: string) {
        await supabase.from('applications').delete().eq('id', id)
        fetchApplications()
    }

    async function handleUpdate(id: string, newStatus: string) {
        await supabase.from('applications').update({ status: newStatus }).eq('id', id)
        fetchApplications()
    }

    const filtered = applications.filter(app => filter === 'All' || app.status === filter)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        + Add Application
                    </button>
                </div>
                <p className="text-sm text-gray-400 mb-6">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>

                {/* Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                filter === s
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Applications */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg">No applications found.</p>
                        <p className="text-sm mt-1">Add one to get started.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map(app => (
                            <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
                                {/* Left: company + role */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 truncate">{app.company}</h3>
                                    <p className="text-sm text-gray-500 truncate">{app.role}</p>
                                    {app.notes && <p className="text-xs text-gray-400 mt-1 truncate">{app.notes}</p>}
                                </div>

                                {/* Right: status badge + dropdown + delete */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {app.status}
                                    </span>
                                    <select
                                        value={app.status}
                                        onChange={e => handleUpdate(app.id, e.target.value)}
                                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option>Applied</option>
                                        <option>Interview</option>
                                        <option>Rejected</option>
                                        <option>Offer</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showModal && (
                <AddApplicationModal
                    onClose={() => setShowModal(false)}
                    onAdded={fetchApplications}
                />
            )}
        </div>
    )
}