import { Badge } from './ui/Badge';
import { ExpandableCard } from './ui/Card';
import type { Patient } from '../types/patient';
import { Mail, Phone, Calendar, FileText, ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface PatientCardProps {
    patient: Patient;
    isExpanded: boolean;
    onToggle: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function PatientCard({ patient, isExpanded, onToggle }: PatientCardProps) {
    const photoUrl = patient.documentPhotoUrl.startsWith('http')
        ? patient.documentPhotoUrl
        : `${API_URL}${patient.documentPhotoUrl}`;

    const header = (
        <div className="flex items-center gap-4">
            <div className="relative">
                <img
                    src={photoUrl}
                    alt={patient.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-medicore-light"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.fullName)}&background=random`;
                    }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-medicore-success border-2 border-white rounded-full" />
            </div>
            <div>
                <h3 className="font-bold text-medicore-text-primary leading-tight">
                    {patient.fullName}
                </h3>
                <p className="text-xs text-medicore-text-secondary mt-0.5">
                    ID: #PT-{patient.id.slice(0, 5).toUpperCase()} • Registered {new Date(patient.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                    <Badge variant="info" className="text-[10px] uppercase tracking-wider">General Practice</Badge>
                    <Badge variant="success" className="text-[10px] uppercase tracking-wider">Active</Badge>
                </div>
            </div>
        </div>
    );

    return (
        <ExpandableCard
            header={header}
            isExpanded={isExpanded}
            onToggle={onToggle}
            className={isExpanded ? 'ring-2 ring-medicore-brand/10 bg-gray-50/30' : ''}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Contact Info</h4>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-sm text-medicore-text-secondary">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-medicore-text-secondary">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{patient.phoneCountryCode} {patient.phoneNumber}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Upcoming (Simulated)</h4>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-medicore-light rounded-lg">
                                <Calendar className="w-4 h-4 text-medicore-brand" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-medicore-text-primary">Medical Checkup</p>
                                <p className="text-xs text-medicore-text-secondary">Jan 30, 2026 • 10:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Recent Documents</h4>
                    <div className="flex gap-2">
                        <div className="w-12 h-12 bg-medicore-light rounded-xl flex items-center justify-center text-medicore-text-secondary hover:bg-gray-200 transition-colors cursor-pointer">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="w-12 h-12 bg-medicore-light rounded-xl flex items-center justify-center text-medicore-text-secondary hover:bg-gray-200 transition-colors cursor-pointer">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" size="sm" className="text-xs bg-white">View History</Button>
                <Button variant="primary" size="sm" className="text-xs">Edit Profile</Button>
            </div>
        </ExpandableCard>
    );
}
