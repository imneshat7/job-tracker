import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AddApplicationModal from '../components/AddApplicationModal'

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
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

    async function handleDelete(id) {
        await supabase.from('applications').delete().eq('id', id)
        fetchApplications()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Job Tracker</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Add Application
                    </button>
                </div>

                <div className="flex gap-2 mb-6">
                    {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === s
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {applications.length === 0 ? (
                    <p className="text-gray-500">No applications yet. Add one!</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications
                            .filter(app => filter === 'All' || app.status === filter)
                            .map(app => (
                                <div key={app.id} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{app.company}</h3>
                                            <p className="text-gray-500">{app.role}</p>
                                            {app.notes && <p className="text-sm text-gray-400 mt-2">{app.notes}</p>}
                                        </div>
                                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${app.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                                            app.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            className='text-red-400  hover:text-red-600 text-sm ml-4'
                                        >
                                            Delete
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