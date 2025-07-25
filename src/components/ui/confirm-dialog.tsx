"use client";

import { X } from "lucide-react";

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export function ConfirmDialog({ isOpen, onClose, children }: ConfirmDialogProps) {
	return (
		<div
			onClick={onClose}
			className={`fixed inset-0 z-50 flex justify-center items-center transition-colors ${isOpen ? "visible bg-black/20" : "invisible"}`}
		>
			<div 
				onClick={e => e.stopPropagation()} 
				className={`relative bg-white rounded-xl shadow-lg p-6 transition-all ${isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"}`} 
			>
				<button 
					onClick={onClose} 
					className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
				>
					<X className="h-4 w-4" />
				</button>
				{children}
			</div>
		</div>
	)
}