import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/input-field';
import { Label } from '@/components/ui/label';
import { type Contact } from '@/redux/contactsSlice';

export interface ContactFormValues {
    name: string;
    phoneNumber: string;
}

interface ContactFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingContact: Contact | null;
    onSave: (data: ContactFormValues) => void;
    existingContacts: Contact[];
}

export const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
    open,
    onOpenChange,
    editingContact,
    onSave,
    existingContacts,
}) => {
    const methods = useForm<ContactFormValues>({
        defaultValues: {
            name: '',
            phoneNumber: '',
        },
    });

    const { reset, handleSubmit, register } = methods;

    useEffect(() => {
        if (open) {
            if (editingContact) {
                reset({
                    name: editingContact.name,
                    phoneNumber: editingContact.phoneNumber.startsWith('+2')
                        ? editingContact.phoneNumber.slice(2)
                        : editingContact.phoneNumber,
                });
            } else {
                reset({
                    name: '',
                    phoneNumber: '',
                });
            }
        }
    }, [open, editingContact, reset]);

    const onSubmit = (data: ContactFormValues) => {
        onSave({
            ...data,
            phoneNumber: `+2${data.phoneNumber}`
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingContact ? 'Edit Contact' : 'Add New Contact'}
                    </DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <InputField
                                id="name"
                                placeholder="Enter contact name"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Name must be at least 3 characters',
                                    },
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <InputField
                                id="phoneNumber"
                                prefixText="+2"
                                placeholder="01012345678"
                                {...register('phoneNumber', {
                                    required: 'Phone number is required',
                                    validate: {
                                        startWith: (value) =>
                                            /^01[0125]/.test(value) || 'Phone number must start with 010, 011, 012, or 015',
                                        length: (value) =>
                                            value.length === 11 || 'Phone number must be exactly 11 digits',
                                        duplicate: (value) => {
                                            const fullNumber = `+2${value}`;
                                            const isDuplicate = existingContacts.some(
                                                (c) =>
                                                    c.phoneNumber === fullNumber &&
                                                    c.id !== editingContact?.id
                                            );
                                            return isDuplicate ? 'Phone number already exists' : true;
                                        }
                                    }
                                })}
                            />
                        </div>
                        <DialogFooter className="pt-4 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer bg-gray-200 text-muted-foreground hover:bg-gray-100 hover:text-gray-800"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                                {editingContact ? 'Save Changes' : 'Add Contact'}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};
