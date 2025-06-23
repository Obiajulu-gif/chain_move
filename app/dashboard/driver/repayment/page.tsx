import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DriverRepaymentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <Card className="bg-card border-border text-foreground">
          <CardHeader>
            <CardTitle>Repayment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-muted-foreground">Total Amount Due:</p>
                <p className="text-foreground">$1,500.00</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date:</p>
                <p className="text-foreground">2024-03-15</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Payment:</p>
                <p className="text-foreground">$500.00 on 2024-02-15</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method:</p>
                <p className="text-foreground">Credit Card</p>
              </div>
              <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Make a Payment</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DriverRepaymentPage
