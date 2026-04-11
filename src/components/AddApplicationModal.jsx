import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AddApplicationModal({ onClose, onAdded }) {
    const { user } = useAuth()
    const [company, setCompany] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('Applied')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit() {
        if (!company || !role) {
            setError('Company and role are required.')
            return
        }

        setLoading(true)
        setError(null)

        const { error } = await supabase.from('applications').insert({
            user_id: user.id,
            company,
            role,
            status,
            notes,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            onAdded()
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-6">Add Application</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="text"
                    placeholder="Company"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Rejected</option>
                    <option>Offer</option>
                </select>
                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}