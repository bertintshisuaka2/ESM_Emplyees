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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
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

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: employees, isLoading } = trpc.employees.list.useQuery();

  const createMutation = trpc.employees.create.useMutation({
    onSuccess: () => {
      utils.employees.list.invalidate();
      setIsAddDialogOpen(false);
      toast.success("Employee added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.employees.update.useMutation({
    onSuccess: () => {
      utils.employees.list.invalidate();
      setEditingEmployee(null);
      toast.success("Employee updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.employees.delete.useMutation({
    onSuccess: () => {
      utils.employees.list.invalidate();
      setDeleteEmployeeId(null);
      toast.success("Employee deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      position: formData.get("position") as string,
      department: formData.get("department") as string,
      hireDate: formData.get("hireDate")
        ? new Date(formData.get("hireDate") as string)
        : undefined,
      salary: formData.get("salary") as string,
      address: formData.get("address") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      status: formData.get("status") as "active" | "inactive" | "terminated",
    };

    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredEmployees = employees?.filter((emp) => {
    const search = searchTerm.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(search) ||
      emp.lastName?.toLowerCase().includes(search) ||
      emp.email?.toLowerCase().includes(search) ||
      emp.department?.toLowerCase().includes(search) ||
      emp.position?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <EmployeeForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Position</TableHead>
              <TableHead className="hidden lg:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredEmployees?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.email || "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {employee.position || "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {employee.department || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/employees/${employee.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingEmployee(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteEmployeeId(employee.id)}
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
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleSubmit}
            defaultValues={editingEmployee}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteEmployeeId}
        onOpenChange={(open) => !open && setDeleteEmployeeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteEmployeeId && deleteMutation.mutate({ id: deleteEmployeeId })
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

function EmployeeForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValues?: any;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={defaultValues?.firstName}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={defaultValues?.lastName}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email || ""}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            defaultValue={defaultValues?.position || ""}
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            defaultValue={defaultValues?.department || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hireDate">Hire Date</Label>
          <Input
            id="hireDate"
            name="hireDate"
            type="date"
            defaultValue={
              defaultValues?.hireDate
                ? new Date(defaultValues.hireDate).toISOString().split("T")[0]
                : ""
            }
          />
        </div>
        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            name="salary"
            defaultValue={defaultValues?.salary || ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          defaultValue={defaultValues?.address || ""}
        />
      </div>

      <div>
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Textarea
          id="emergencyContact"
          name="emergencyContact"
          defaultValue={defaultValues?.emergencyContact || ""}
          placeholder="Name, relationship, phone number"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={defaultValues?.status || "active"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          {defaultValues ? "Update" : "Add"} Employee
        </Button>
      </div>
    </form>
  );
}

