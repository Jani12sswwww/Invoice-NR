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

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Rizwan",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "ri2976854@gmail.com" }],
      template_uuid: "47800bc8-da5e-4fed-9d9f-6444f539be58",
    template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "NR repair service",
        company_info_address: "Plaza lowyat 2nd floor",
        company_info_city: "Kuala Lumpur",
        company_info_zip_code: "55100",
        company_info_country: "Malaysia",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}