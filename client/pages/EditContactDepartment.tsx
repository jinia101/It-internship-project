import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getServices, updateService } from "../lib/localStorageUtils";

export default function EditContactDepartment() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [offices, setOffices] = useState([
    { officeName: "", address: "", district: "", block: "" },
  ]);
  const [posts, setPosts] = useState([{ postName: "", officeIndex: 0 }]);
  const [employees, setEmployees] = useState([
    { employeeName: "", postIndex: 0, email: "", phone: "" },
  ]);

  useEffect(() => {
    const services = getServices();
    const dept = services.find(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (dept) {
      if (dept.offices) setOffices(dept.offices);
      if (dept.posts) setPosts(dept.posts);
      if (dept.employees) setEmployees(dept.employees);
    }
  }, [name]);

  // Office handlers
  const addOffice = () =>
    setOffices([
      ...offices,
      { officeName: "", address: "", district: "", block: "" },
    ]);
  const handleOfficeChange = (idx, e) => {
    const { name, value } = e.target;
    setOffices(
      offices.map((o, i) => (i === idx ? { ...o, [name]: value } : o)),
    );
  };
  const removeOffice = (idx) => {
    if (offices.length > 1) setOffices(offices.filter((_, i) => i !== idx));
  };

  // Post handlers
  const addPost = () => setPosts([...posts, { postName: "", officeIndex: 0 }]);
  const handlePostChange = (idx, e) => {
    const { name, value } = e.target;
    setPosts(posts.map((p, i) => (i === idx ? { ...p, [name]: value } : p)));
  };
  const handlePostOfficeChange = (idx, value) => {
    setPosts(
      posts.map((p, i) =>
        i === idx ? { ...p, officeIndex: Number(value) } : p,
      ),
    );
  };
  const removePost = (idx) => {
    if (posts.length > 1) setPosts(posts.filter((_, i) => i !== idx));
  };

  // Employee handlers
  const addEmployee = () =>
    setEmployees([
      ...employees,
      { employeeName: "", postIndex: 0, email: "", phone: "" },
    ]);
  const handleEmployeeChange = (idx, e) => {
    const { name, value } = e.target;
    setEmployees(
      employees.map((emp, i) => (i === idx ? { ...emp, [name]: value } : emp)),
    );
  };
  const handleEmployeePostChange = (idx, value) => {
    setEmployees(
      employees.map((emp, i) =>
        i === idx ? { ...emp, postIndex: Number(value) } : emp,
      ),
    );
  };
  const removeEmployee = (idx) => {
    if (employees.length > 1)
      setEmployees(employees.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    // Find and update the department in localStorage
    const services = getServices();
    const idx = services.findIndex(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (idx !== -1) {
      services[idx].offices = offices;
      services[idx].posts = posts;
      services[idx].employees = employees;
      updateService(services[idx]);
    }
    navigate("/admin-contact-service");
  };

  const handlePublish = () => {
    // Find and update the department in localStorage
    const services = getServices();
    const idx = services.findIndex(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (idx !== -1) {
      services[idx].offices = offices;
      services[idx].posts = posts;
      services[idx].employees = employees;
      services[idx].status = "published";
      updateService(services[idx]);
    }
    navigate("/admin-contact-service");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Department: {decodeURIComponent(name || "")}
        </h1>
        {/* Offices Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Offices</CardTitle>
            <CardDescription>
              Add offices under this department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offices.map((office, idx) => (
              <div key={idx} className="mb-4 border-b pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label>Office Name</Label>
                    <Input
                      name="officeName"
                      value={office.officeName}
                      onChange={(e) => handleOfficeChange(idx, e)}
                      placeholder="Enter office name"
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={office.address}
                      onChange={(e) => handleOfficeChange(idx, e)}
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input
                      name="district"
                      value={office.district}
                      onChange={(e) => handleOfficeChange(idx, e)}
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <Label>Block</Label>
                    <Input
                      name="block"
                      value={office.block}
                      onChange={(e) => handleOfficeChange(idx, e)}
                      placeholder="Enter block"
                    />
                  </div>
                </div>
                {offices.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeOffice(idx)}
                    className="mt-2 bg-blue-100 text-blue-700"
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addOffice} className="mt-2">
              + Add Office
            </Button>
          </CardContent>
        </Card>
        {/* Posts Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Create posts under each office.</CardDescription>
          </CardHeader>
          <CardContent>
            {posts.map((post, idx) => (
              <div key={idx} className="mb-4 border-b pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label>Post Name</Label>
                    <Input
                      name="postName"
                      value={post.postName}
                      onChange={(e) => handlePostChange(idx, e)}
                      placeholder="Enter post name"
                    />
                  </div>
                  <div>
                    <Label>Office</Label>
                    <Select
                      value={String(post.officeIndex)}
                      onValueChange={(val) => handlePostOfficeChange(idx, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select office" />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((office, oidx) => (
                          <SelectItem key={oidx} value={String(oidx)}>
                            {office.officeName || `Office ${oidx + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {posts.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removePost(idx)}
                    className="mt-2 bg-blue-100 text-blue-700"
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addPost} className="mt-2">
              + Add Post
            </Button>
          </CardContent>
        </Card>
        {/* Employees Section */}
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Add employees to specific posts.</CardDescription>
          </CardHeader>
          <CardContent>
            {employees.map((emp, idx) => (
              <div key={idx} className="mb-4 border-b pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label>Employee Name</Label>
                    <Input
                      name="employeeName"
                      value={emp.employeeName}
                      onChange={(e) => handleEmployeeChange(idx, e)}
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <Label>Post</Label>
                    <Select
                      value={String(emp.postIndex)}
                      onValueChange={(val) =>
                        handleEmployeePostChange(idx, val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post" />
                      </SelectTrigger>
                      <SelectContent>
                        {posts.map((post, pidx) => (
                          <SelectItem key={pidx} value={String(pidx)}>
                            {post.postName || `Post ${pidx + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      value={emp.email}
                      onChange={(e) => handleEmployeeChange(idx, e)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      name="phone"
                      value={emp.phone}
                      onChange={(e) => handleEmployeeChange(idx, e)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                {employees.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeEmployee(idx)}
                    className="mt-2 bg-blue-100 text-blue-700"
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addEmployee} className="mt-2">
              + Add Employee
            </Button>
          </CardContent>
        </Card>
        <Button
          className="mt-8 w-full bg-green-600 text-white"
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}
