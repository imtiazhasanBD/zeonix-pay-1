import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const paymentMethods = [
    { type: "Bank Account", details: "Wells Fargo **** 1234", isPrimary: true },
    { type: "Debit Card", details: "Visa **** 5678", isPrimary: false },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Payment Methods</CardTitle>
          <CardDescription>
            Manage your connected bank accounts and cards.
          </CardDescription>
        </div>
        <Button>Add Method</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.details}
            className="border rounded-md p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium flex items-center">
                {method.type}
                {method.isPrimary && (
                  <Badge variant="outline" className="ml-2">
                    Primary
                  </Badge>
                )}
              </p>
              <p className="text-sm text-muted-foreground">{method.details}</p>
            </div>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Page;
