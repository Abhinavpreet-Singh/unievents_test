import { type Prisma, prisma } from "@voltaze/db";
import type {
	CreatePaymentInput,
	PaymentFilterInput,
	RazorpayWebhookInput,
	UpdatePaymentInput,
} from "@voltaze/schema";

import { BadRequestError, NotFoundError } from "@/common/exceptions/app-error";

export class PaymentsService {
	async list(input: PaymentFilterInput) {
		const { page, limit, sortBy, sortOrder, ...filters } = input;
		const skip = (page - 1) * limit;

		return prisma.payment.findMany({
			where: {
				...filters,
				deletedAt: null,
			},
			orderBy: { [sortBy]: sortOrder },
			skip,
			take: limit,
		});
	}

	async getById(id: string) {
		const payment = await prisma.payment.findUnique({ where: { id } });
		if (!payment || payment.deletedAt)
			throw new NotFoundError("Payment not found");
		return payment;
	}

	async create(input: CreatePaymentInput) {
		const order = await prisma.order.findUnique({
			where: { id: input.orderId },
		});
		if (!order || order.deletedAt) throw new NotFoundError("Order not found");

		return prisma.payment.create({ data: input });
	}

	async update(id: string, input: UpdatePaymentInput) {
		await this.getById(id);
		const { orderId: _ignoredOrderId, gatewayMeta, ...rest } = input;
		const data = {
			...rest,
			gatewayMeta: gatewayMeta as Prisma.InputJsonValue | undefined,
		};
		return prisma.payment.update({ where: { id }, data });
	}

	async handleWebhook(input: RazorpayWebhookInput) {
		const transactionId = input.payload.payment.id;
		const status = input.payload.payment.status.toLowerCase();
		const mappedStatus =
			status === "captured"
				? "SUCCESS"
				: status === "failed"
					? "FAILED"
					: "PENDING";

		const payment = await prisma.payment.findFirst({
			where: { transactionId },
		});
		if (!payment) throw new BadRequestError("Payment transaction not found");

		return prisma.payment.update({
			where: { id: payment.id },
			data: {
				status: mappedStatus,
				gatewayMeta: input,
			},
		});
	}
}

export const paymentsService = new PaymentsService();
