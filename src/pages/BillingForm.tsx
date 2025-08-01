import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowRight, User, Calendar, TestTube, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const DOCTORS = [
  "Dr. Santosh Pujari (MS - Ayu, ENT, Ph.D)",
  "Dr. Vinod JB (MS - Ayu)",
  "Dr. Avinash Bhavikatti (MBBS, MS, Surgical Gastroenterology)",
  "Dr. Divya Bhavikatti (MBBS, MS - OBG)",
  "Dr. Sana Kouser Jamadar (MBBS, Family Physician)",
  "Dr. Vijaykumar Nayak (MS - Ayu, Ph.D)"
];

const DIAGNOSTIC_TESTS = [
  { name: "CBC", prices: [{ variant: "Standard", price: 300 }, { variant: "Premium", price: 350 }] },
  { name: "Hb%", prices: [{ variant: "", price: 100 }] },
  { name: "ESR", prices: [{ variant: "", price: 200 }] },
  { name: "BRUCELLA", prices: [{ variant: "", price: 850 }] },
  { name: "THYROID PROFILE", prices: [{ variant: "", price: 700 }] },
  { name: "CD4, CD8", prices: [{ variant: "", price: 2200 }] },
  { name: "WESTREN'S BLOT", prices: [{ variant: "", price: 3000 }] },
  { name: "HBA1C", prices: [{ variant: "", price: 850 }] }
];

const BillingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patientData, setPatientData] = useState<PatientData>({
    name: "",
    age: "",
    sex: "",
    date: new Date().toISOString().split('T')[0],
    referredDoctors: [],
    selectedTests: []
  });

  const [selectedTest, setSelectedTest] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("");

  const handleDoctorToggle = (doctor: string) => {
    setPatientData(prev => ({
      ...prev,
      referredDoctors: prev.referredDoctors.includes(doctor)
        ? prev.referredDoctors.filter(d => d !== doctor)
        : [...prev.referredDoctors, doctor]
    }));
  };

  const addTest = () => {
    if (!selectedTest || selectedPrice === null) {
      toast({
        title: "Please select a test and price",
        variant: "destructive"
      });
      return;
    }

    const newTest = {
      name: selectedTest,
      price: selectedPrice,
      variant: selectedVariant
    };

    setPatientData(prev => ({
      ...prev,
      selectedTests: [...prev.selectedTests, newTest]
    }));

    setSelectedTest("");
    setSelectedPrice(null);
    setSelectedVariant("");
  };

  const removeTest = (index: number) => {
    setPatientData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return patientData.selectedTests.reduce((sum, test) => sum + test.price, 0);
  };

  const handleNext = () => {
    if (!patientData.name || !patientData.age || !patientData.sex) {
      toast({
        title: "Please fill all patient details",
        variant: "destructive"
      });
      return;
    }

    if (patientData.referredDoctors.length === 0) {
      toast({
        title: "Please select at least one referring doctor",
        variant: "destructive"
      });
      return;
    }

    if (patientData.selectedTests.length === 0) {
      toast({
        title: "Please add at least one diagnostic test",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('billingData', JSON.stringify(patientData));
    navigate('/report');
  };

  const currentTest = DIAGNOSTIC_TESTS.find(test => test.name === selectedTest);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Dr. Pujar Hospital</h1>
          <p className="text-lg text-muted-foreground">Diagnostic Laboratory Billing System</p>
        </div>

        {/* Patient Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Details
            </CardTitle>
            <CardDescription>Enter patient information for the diagnostic tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  value={patientData.name}
                  onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={patientData.age}
                  onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select value={patientData.sex} onValueChange={(value) => setPatientData(prev => ({ ...prev, sex: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={patientData.date}
                  onChange={(e) => setPatientData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referring Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Referring Doctors
            </CardTitle>
            <CardDescription>Select one or more referring doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DOCTORS.map((doctor) => (
                <div key={doctor} className="flex items-center space-x-2">
                  <Checkbox
                    id={doctor}
                    checked={patientData.referredDoctors.includes(doctor)}
                    onCheckedChange={() => handleDoctorToggle(doctor)}
                  />
                  <Label htmlFor={doctor} className="text-sm font-normal cursor-pointer">
                    {doctor}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Diagnostic Tests
            </CardTitle>
            <CardDescription>Add diagnostic tests and their pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test">Select Test</Label>
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose diagnostic test" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAGNOSTIC_TESTS.map((test) => (
                      <SelectItem key={test.name} value={test.name}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {currentTest && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price Option</Label>
                  <Select 
                    value={selectedPrice?.toString() || ""} 
                    onValueChange={(value) => {
                      const price = parseInt(value);
                      setSelectedPrice(price);
                      const priceOption = currentTest.prices.find(p => p.price === price);
                      setSelectedVariant(priceOption?.variant || "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentTest.prices.map((priceOption, index) => (
                        <SelectItem key={index} value={priceOption.price.toString()}>
                          ₹{priceOption.price} {priceOption.variant && `(${priceOption.variant})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-end">
                <Button onClick={addTest} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Tests Summary */}
        {patientData.selectedTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Tests Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientData.selectedTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{test.name}</Badge>
                    {test.variant && <span className="text-sm text-muted-foreground">({test.variant})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">₹{test.price}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTest(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{calculateTotal()}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        <div className="flex justify-end">
          <Button onClick={handleNext} size="lg" className="px-8">
            Generate Report
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingForm;