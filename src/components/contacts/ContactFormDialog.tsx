import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,

} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Contact } from '@/redux/contactsSlice';
import { Label } from '@radix-ui/react-label';

export interface ContactFormValues {
    name: string;
    phoneNumber: string;
}

interface ContactFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingContact: Contact | null;
    onSave: (data: ContactFormValues) => void;
}

export const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
    open,
    onOpenChange,
    editingContact,
    onSave
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>();

    useEffect(() => {
        if (open) {
            if (editingContact) {
                reset({
                    name: editingContact.name,
                    phoneNumber: editingContact.phoneNumber
                });
            } else {
                reset({
                    name: '',
                    phoneNumber: ''
                });
            }
        }
    }, [open, editingContact, reset]);

    const onSubmit = (data: ContactFormValues) => {
        onSave(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="mb-2 block">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter Contact Name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                            })}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="mb-2 block">Phone Number</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-medium z-10">
                                +2
                            </span>
                            <Input
                                id="phone"
                                placeholder="Enter Phone Number (eg: 01234567890)"
                                {...register('phoneNumber', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^(010|011|012|015)\d{8}$/,
                                        message: 'Must start with 010, 011, 012, or 015'
                                    }
                                })}
                                className={`pl-14 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" className='bg-gray-300 hover:bg-gray-400 text-muted-foreground hover:text-gray-800 cursor-pointer' onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                            {editingContact ? 'Save Changes' : 'Add Contact'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
