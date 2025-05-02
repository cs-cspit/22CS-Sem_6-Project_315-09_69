import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../comman/IconBtn";
import { fetchAllFaculties } from "../../../../services/operations/facultyAPI";
import { creatGroup } from "../../../../services/operations/groupAPI";
import { useNavigate } from "react-router-dom";
import { fetchRemaningStudent } from "../../../../services/operations/studentAPI";
import SgpProjectForm from "./AddMembersForm/SgpProjectForm";
import OtherProjectForm from "./AddMembersForm/OtherProjectForm";

const ProjectMembers = () => {

  const { register, handleSubmit, setValue, watch, getValues } = useForm();
  const [facultyList, setFacultyList] = useState([]);
  const [remaningStudents, setRemaningStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectType = watch("projectType", "SGP");
  const academicYear = watch("academicYear");
  const semester = watch("semester");
  const batch = user.batch;
  const department = user.department;

  {/**set leader details */}
  useEffect(() => {
    setValue("groupMember1.collegeId", user.studentId);
    setValue("groupMember1.batch", user.batch);
    setValue("groupMember1.department", user.department);
  }, [user, setValue]);

  {/**get all faculty */}
  useEffect(() => {
    const getAllFaculty = async () => {
      setLoading(true);
      const faculties = await fetchAllFaculties();
      if (faculties.length > 0) {
        setFacultyList(faculties);
      }
      setLoading(false);
    };
    getAllFaculty();
  }, []);

  {/**get all remaining students */}
  useEffect(() => {
    if (academicYear && semester) {
      const getRemaingStudents = async () => {
        setLoading(true);
        try {
          const data = {
            batch,
            department,
            academicYear,
            semester,
          };
          const students = await fetchRemaningStudent(data, token);
          setRemaningStudents(students || []);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };
      getRemaingStudents();
    }
    console.log(remaningStudents);
    
  }, [batch, department, academicYear, semester, token]);


  {/**on submit */}
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const {
        projectType,
        groupMember2,
        groupMember3,
        academicYear,
        mentorName,
        semester,
      } = data;

      const studentIds = []; // Always include leader

      if (projectType === "SGP") {
        if (groupMember2?.collegeId) studentIds.push(groupMember2.collegeId);
        if (groupMember3?.collegeId) studentIds.push(groupMember3.collegeId);
      } else {
        // Handle dynamic members for Open Project
        let index = 1;
        while (data[`dynamicMember${index}`]?.collegeId) {
          studentIds.push(data[`dynamicMember${index}`].collegeId);
          index++;
        }
      }

      const groupDepartment =
        projectType === "Other Project" ? "MultiDisciplinary" : user.department;

      console.log(projectType);  
      await dispatch(
        creatGroup(
          mentorName,
          projectType,
          semester,
          academicYear,
          studentIds,
          groupDepartment,
          token,
          navigate
        )
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col mt-6">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-semibold text-[#170F49] font-poppins">
          Project Members
        </h2>
        <p className="mb-4 text-[#6F6C90]">
          Fill out project member details to complete all steps.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        {/* Faculty Selection */}
        <div className="flex flex-col gap-y-2">
          <label className="block text-sm font-medium font-poppins text-[#170F49]">
            Project Guide
          </label>
          <select
            {...register("mentorName", { required: true })}
            className="mt-1 block w-full h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
          >
            <option value="">Faculty name</option>
            {facultyList.map((faculty) => (
              <option key={faculty.id} value={faculty.profile.name}>
                {faculty.profile.name}
              </option>
            ))}
          </select>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-3 gap-x-12">
          <div className="flex flex-col gap-y-2">
            <label className="block text-sm font-medium font-poppins text-[#170F49]">
              Project Type
            </label>
            <select
              {...register("projectType", { required: true })}
              className="mt-1 block w-full h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
            >
              <option value="SGP">SGP</option>
              <option value="Other Project">Other Project</option>
            </select>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="block text-sm font-medium font-poppins text-[#170F49]">
              Semester
            </label>
            <select
              {...register("semester", { required: true })}
              className="mt-1 block w-full h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
            >
              {[3, 4, 5, 6, 7].map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="block text-sm font-medium font-poppins text-[#170F49]">
              Academic Year
            </label>
            <input
              type="text"
              placeholder="e.g., 2023-24"
              {...register("academicYear", { required: true })}
              className="h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
            />
          </div>
        </div>

        {projectType === "SGP" ? (
          <SgpProjectForm
            register={register}
            setValue={setValue}
            remaningStudents={remaningStudents}
          />
        ) : (
          <OtherProjectForm register={register} />
        )}

        <div className="flex flex-row-reverse mt-4">
          <IconBtn type="submit" customClasses="bg-[#4a3aff]">
            Next Step
          </IconBtn>
        </div>
      </form>
    </div>
  );
};

export default ProjectMembers;
