import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Accidents() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccident, setEditingAccident] = useState<any>(null);
  const [deleteAccidentId, setDeleteAccidentId] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: accidents, isLoading } = trpc.accidents.list.useQuery();
  const { data: employees } = trpc.employees.list.useQuery();

  const createMutation = trpc.accidents.create.useMutation({
    onSuccess: () => {
      utils.accidents.list.invalidate();
      setIsAddDialogOpen(false);
      toast.success("Accident report added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.accidents.update.useMutation({
    onSuccess: () => {
      utils.accidents.list.invalidate();
      setEditingAccident(null);
      toast.success("Accident report updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.accidents.delete.useMutation({
    onSuccess: () => {
      utils.accidents.list.invalidate();
      setDeleteAccidentId(null);
      toast.success("Accident report deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      employeeId: formData.get("employeeId") as string,
      accidentDate: new Date(formData.get("accidentDate") as string),
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as
        | "minor"
        | "moderate"
        | "severe"
        | "critical",
      witnesses: formData.get("witnesses") as string,
      treatmentProvided: formData.get("treatmentProvided") as string,
    };

    if (editingAccident) {
      updateMutation.mutate({ id: editingAccident.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find((e) => e.id === employeeId);
    return employee
      ? `${employee.firstName} ${employee.lastName}`
      : "Unknown";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "bg-blue-100 text-blue-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "severe":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accident Reports</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage workplace accidents
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Accident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report New Accident</DialogTitle>
            </DialogHeader>
            <AccidentForm onSubmit={handleSubmit} employees={employees || []} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : accidents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No accident reports found
                </TableCell>
              </TableRow>
            ) : (
              accidents?.map((accident) => (
                <TableRow key={accident.id}>
                  <TableCell className="font-medium">
                    {getEmployeeName(accident.employeeId)}
                  </TableCell>
                  <TableCell>
                    {new Date(accident.accidentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {accident.location || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(accident.severity)}`}
                    >
                      {accident.severity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingAccident(accident)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteAccidentId(accident.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingAccident}
        onOpenChange={(open) => !open && setEditingAccident(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Accident Report</DialogTitle>
          </DialogHeader>
          <AccidentForm
            onSubmit={handleSubmit}
            defaultValues={editingAccident}
            employees={employees || []}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteAccidentId}
        onOpenChange={(open) => !open && setDeleteAccidentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              accident report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteAccidentId &&
                deleteMutation.mutate({ id: deleteAccidentId })
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AccidentForm({
  onSubmit,
  defaultValues,
  employees,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValues?: any;
  employees: any[];
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="employeeId">Employee *</Label>
        <Select
          name="employeeId"
          defaultValue={defaultValues?.employeeId}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accidentDate">Accident Date *</Label>
          <Input
            id="accidentDate"
            name="accidentDate"
            type="datetime-local"
            defaultValue={
              defaultValues?.accidentDate
                ? new Date(defaultValues.accidentDate)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="severity">Severity *</Label>
          <Select
            name="severity"
            defaultValue={defaultValues?.severity || "minor"}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={defaultValues?.location || ""}
          placeholder="Where did the accident occur?"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description || ""}
          placeholder="Describe what happened..."
          required
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="witnesses">Witnesses</Label>
        <Textarea
          id="witnesses"
          name="witnesses"
          defaultValue={defaultValues?.witnesses || ""}
          placeholder="Names of witnesses, if any"
        />
      </div>

      <div>
        <Label htmlFor="treatmentProvided">Treatment Provided</Label>
        <Textarea
          id="treatmentProvided"
          name="treatmentProvided"
          defaultValue={defaultValues?.treatmentProvided || ""}
          placeholder="First aid or medical treatment provided"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          {defaultValues ? "Update" : "Submit"} Report
        </Button>
      </div>
    </form>
  );
}

