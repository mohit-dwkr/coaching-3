import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeeTransaction } from "../types";

interface RecentTransactionsProps {
    transactions: FeeTransaction[];
}

export default function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    const recentTransactions = transactions.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>

            <CardContent>
                {recentTransactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No recent transactions found.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between border-b pb-3 last:border-0"
                            >
                                <div>
                                    <p className="font-medium">
                                        Transaction #{transaction.id.slice(0, 8)}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {transaction.payment_mode}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold">
                                        ₹{transaction.amount.toLocaleString("en-IN")}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {new Date(transaction.transaction_date).toLocaleDateString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}