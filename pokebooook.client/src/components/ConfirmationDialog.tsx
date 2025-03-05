import React from 'react';
import ConfirmationDialogCSS from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => {
    if (!isOpen) return null;

    return (
        <div className={ConfirmationDialogCSS.overlay}>
            <div className={ConfirmationDialogCSS.dialog}>
                <h2 className={ConfirmationDialogCSS.title}>{title}</h2>
                <p className={ConfirmationDialogCSS.message}>{message}</p>
                <div className={ConfirmationDialogCSS.buttons}>
                    <button
                        className={`${ConfirmationDialogCSS.button} ${ConfirmationDialogCSS.cancelButton}`}
                        onClick={onClose}
                    >
                        Zrušit
                    </button>
                    <button
                        className={`${ConfirmationDialogCSS.button} ${ConfirmationDialogCSS.confirmButton}`}
                        onClick={onConfirm}
                    >
                        Potvrdit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog; 