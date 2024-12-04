import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    // Await the params to destructure
    const { invoiceId } = await params;

    // Fetch the invoice data
    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (!invoiceData.clientEmail) {
      return NextResponse.json(
        { error: "Client email is not available" },
        { status: 400 }
      );
    }

    // Define sender details
    const sender = {
      email: "hello@nr-repair-service.com",
      name: "NR Repair Service",
    };

    // Send the email
    await emailClient.send({
      from: sender,
      to: [{ email: invoiceData.clientEmail }],
      template_uuid: "47800bc8-da5e-4fed-9d9f-6444f539be58",
      template_variables: {
        first_name: invoiceData.clientName || "Valued Customer",
        company_info_name: "NR Repair Service",
        company_info_address: "Plaza Lowyat, 2nd Floor",
        company_info_city: "Kuala Lumpur",
        company_info_zip_code: "55100",
        company_info_country: "Malaysia",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email reminder:", error);
    return NextResponse.json(
      { error: "Failed to send email reminder" },
      { status: 500 }
    );
  }
}
