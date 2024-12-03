import {z} from 'zod'
export const onboardingSchema = z.object({
    firstName: z.string().min(2, " First name is required "),
    lastName: z.string().min(2, " Last name is required "),
    address: z.string().min(2, " Address is required "),
}) 

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, "Invoice Name is required"), // Corrected "Nmae" to "Name"
    total: z.number().min(1, "1RM is minimum"),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.string().min(1, "Due Date is required"),
    fromName: z.string().min(1, "Your Name is required"),
    fromEmail: z.string().email("Invalid Email address"),
    fromAddress: z.string().min(1, "Your address is required"),
    clientName: z.string().min(1, "Client Name is required"),
    clientEmail: z.string().email("Invalid Email address"),
    clientAddress: z.string().min(1, "Client address is required"), // Added a space in "Client address"
    currency: z.string().min(1, "Currency is required"), // Corrected "currency" to start with uppercase
    invoiceNumber: z.number().min(1, "Minimum invoice number is 1"), // Fixed "Mininum" and "numbern"
    note: z.string().optional(),
    invoiceItemDescription: z.string().min(1, "Description is required"), // Removed extra space at the end
    invoiceItemQuantity: z.number().min(1, "Quantity minimum is 1"), // Added clarity to the error message
    invoiceItemRate: z.number().min(1, "Rate minimum is 1") // Added clarity to the error message
});
