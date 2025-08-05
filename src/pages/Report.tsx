import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, FileText, User, Calendar, Stethoscope, TestTube } from "lucide-react";

interface PatientData {
  name: string;
  age: string;
  sex: string;
  date: string;
  referredDoctors: string[];
  selectedTests: Array<{
    name: string;
    price: number;
    variant?: string;
  }>;
}

const Report = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('billingData');
    if (savedData) {
      setPatientData(JSON.parse(savedData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    if (!patientData) return 0;
    return patientData.selectedTests.reduce((sum, test) => sum + test.price, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Print-hidden header */}
      <div className="print:hidden bg-card border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="py-8 px-4 print:py-6 print:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hospital Header */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-4xl font-bold text-primary mb-2 print:text-3xl">Dr. Pujar Hospital</h1>
            <p className="text-xl text-muted-foreground print:text-lg">Diagnostic Laboratory</p>
            <p className="text-sm text-muted-foreground mt-2">Billing Report</p>
          </div>

          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-8 print:p-6">
              {/* Patient Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Patient Information</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-accent/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="font-semibold">{patientData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="font-semibold">{patientData.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sex</p>
                    <p className="font-semibold">{patientData.sex}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="font-semibold">{formatDate(patientData.date)}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Referring Doctors Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Referring Doctor(s)</h2>
                </div>
                <div className="space-y-2">
                  {patientData.referredDoctors.map((doctor, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary font-medium">•</span>
                      <p className="font-medium">{doctor}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Diagnostic Tests Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TestTube className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Diagnostic Tests</h2>
                </div>
                <div className="space-y-3">
                  {patientData.selectedTests.map((test, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                      <div className="flex-1">
                        <p className="font-semibold">{test.name}</p>
                        {test.variant && (
                          <p className="text-sm text-muted-foreground">({test.variant})</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{test.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Total Section */}
              <div className="mb-8">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">Total Amount:</span>
                    <span className="text-3xl font-bold text-primary">
                      ₹{calculateTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-end mt-12 print:mt-16">
                <div className="text-center">
                  <div className="w-48 border-b border-gray-400 mb-2"></div>
                  <p className="text-sm font-medium">Doctor's Signature</p>
                  <p className="text-xs text-muted-foreground mt-1">Dr. Pujar Hospital</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
                <p>Thank you for choosing Dr. Pujar Hospital Diagnostic Laboratory</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border-0 {
            border: none !important;
          }
          
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          
          .print\\:py-6 {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          
          .print\\:px-6 {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
          
          .print\\:text-3xl {
            font-size: 1.875rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1.125rem !important;
          }
          
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          
          .print\\:mt-16 {
            margin-top: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Report;