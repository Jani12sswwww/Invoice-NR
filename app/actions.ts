"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/fromatCurrency";

export async function onboardUser(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: onboardingSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            firstName: submission.value.firstName,
            lastName: submission.value.lastName,
            address: submission.value.address,
        },
    });

    return redirect("/dashboard"); // Ensure consistent flow upon successful update
}

export async function createInvoice( prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.create({
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: parseInt(submission.value.dueDate, 10),
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            userId: session.user?.id,
        },
        
    });

    
    const sender = {
      email: "hello@nr-repair-service.com",
      name: "NR Repair Service",
    };

    emailClient.send({
        from: sender,
        to: [{email: submission.value.clientEmail}],
        template_uuid: "59888352-521d-429b-9d25-fc71ee5f6e5d",
        template_variables: {
          "clientName": submission.value.clientName,
          "InvoiceNumber": submission.value.invoiceNumber,
          "dueDate": new Intl.DateTimeFormat("en-US", {
            dateStyle: "long"}).format(new Date (submission.value.date)),

          "TotalAmount": formatCurrency({amount: submission.value.total, currency: submission.value.currency as any}),
          invoiceLink:
          process.env.NODE_ENV !== "production"
            ? `http://localhost:3000/api/invoice/${data.id}`
            : `https://nr-repair-service.com//api/invoice/${data.id}`,
      
        },
      });

    
    return redirect("/dashboard/invoices");

    }

    export async function editInvoice(prevState: any, formData: FormData) {
        const session = await requireUser();
      
        const submission = parseWithZod(formData, {
          schema: invoiceSchema,
        });
      
        if (submission.status !== "success") {
          return submission.reply();
        }
      
        const data = await prisma.invoice.update({
          where: {
            id: formData.get("id") as string,
            userId: session.user?.id,
          },
          data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: parseInt(submission.value.dueDate, 10),
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
          },
        });
      
        const sender = {
          email: "hello@nr-repair-service.com",
          name: " NR Repair Service",
        };
      
        emailClient.send({
          from: sender,
          to: [{ email: submission.value.clientEmail }],
          template_uuid: "97e1fa1a-5479-4343-ab5e-a0d3639ababd",
              template_variables: {
            clientName: submission.value.clientName,
            invoiceNumber: submission.value.invoiceNumber,
            invoiceDueDate: new Intl.DateTimeFormat("en-US", {
              dateStyle: "long",
            }).format(new Date(submission.value.date)),
            invoiceAmount: formatCurrency({
              amount: submission.value.total,
              currency: submission.value.currency as any,
            }),
            invoiceLink:
            process.env.NODE_ENV !== "production"
              ? `http://localhost:3000/api/invoice/${data.id}`
              : `https://nr-repair-service.com/api/invoice/${data.id}`,
        
          },
        });
      
        return redirect("/dashboard/invoices");
      }
      
   

      export async function DeleteInvoice(invoiceId: string) {
        const session = await requireUser();
      
        const data = await prisma.invoice.delete({
          where: {
            userId: session.user?.id,
            id: invoiceId,
          },
        });
      
        return redirect("/dashboard/invoices");
      }

      export async function MarkAsPaidAction(invoiceId: string) {
        const session = await requireUser();
      
        const data = await prisma.invoice.update({
          where: {
            userId: session.user?.id,
            id: invoiceId,
          },
          data: {
            status: "PAID",
          },
        });
      
        return redirect("/dashboard/invoices");
      }