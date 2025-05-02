import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../comman/IconBtn";
import { setStep, setProject, setEditProject } from "../../../../slices/projectSlice";
import { toast } from "react-toastify";

const ProjectDetails = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { project, editProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const today = new Date().toISOString().split("T")[0];
  const startDateValue = watch("startDate") || today; 

  console.log(project);

  const handlePrevious = () => {
    dispatch(setStep(2));
    dispatch(setEditProject(true));
  };

  useEffect(() => {
    if (editProject) {
      setValue("description", project.description || null);
      setValue("startDate", project.startDate || null);
      setValue("endDate", project.endDate || null);
      setValue("githubRepoLink", project.githubRepoLink || null);
    }
  }, [editProject, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();

    if (
      currentValues.description !== project.description ||
      currentValues.startDate !== project.startDate ||
      currentValues.endDate !== project.endDate ||
      currentValues.githubRepoLink !== project.githubRepoLink
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = (data) => {
    if (editProject) {
      if (isFormUpdated()) {
        dispatch(setProject({ ...project, ...data }));
        toast.info("Step 3 Completed");
        dispatch(setStep(4));
        toast.success("Project updated successfully");
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }
    console.log("Form Data:", data);
    dispatch(setProject({ ...project, ...data }));
    toast.info("Step 3 Completed");
    dispatch(setStep(4));
  };

  return (
    <div className="flex flex-col mt-6">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-semibold text-[#170F49] font-poppins">
          Project details
        </h2>
        <p className="mb-4 text-[#6F6C90]">
          Add Project details and complete step 3.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        {/* Project Description */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-[#170F49] font-poppins"
          >
            Project Description
          </label>
          <textarea
            id="description"
            type="text"
            placeholder="Ex. Shopping system"
            {...register("description", {
              required: "Project description is required",
            })}
            className={` rounded-lg border-2 ${
              errors.description ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-[#170F49] font-poppins"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              min={today}
              defaultValue={today}
              {...register("startDate", {
                required: "Start date is required",
              })}
              className={`h-12 rounded-lg border-2 ${
                errors.startDate ? "border-red-500" : "border-[#f8f8fa]"
              } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#a3abb9] font-poppins pl-4`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs">{errors.startDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-[#170F49] font-poppins"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              min={startDateValue}
              {...register("endDate", {
                required: "End date is required",
                validate: (value) => {
                  const startDate = getValues("startDate");
                  return (
                    (startDate && value >= startDate) ||
                    "End date must be after start date"
                  );
                },
              })}
              className={`h-12 rounded-lg border-2 ${
                errors.endDate ? "border-red-500" : "border-[#f8f8fa]"
              } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#a3abb9] font-poppins pl-4`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/*Git hub links */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="githubRepoLink"
            className="text-sm font-medium text-[#170F49] font-poppins"
          >
            Github link
          </label>
          <input
            id="githubRepoLink"
            type="url"
            placeholder="www.github/projectname.com"
            {...register("githubRepoLink", {
              required: "GitHub link is required",
              pattern: {
                value:/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/,
                message: "Enter a valid GitHub repository URL",
              },
            })}
            className={`h-12 rounded-xl border-2 pl-4 shadow-md text-sm text-[#6F6C90] font-poppins focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.githubRepoLink ? "border-red-500" : "border-[#f8f8fa]"
            }`}
          />
          {errors.githubRepoLink && (
            <p className="text-red-500 text-xs">
              {errors.githubRepoLink.message}
            </p>
          )}
        </div>

        {/* Other Link */}
        {/* <div className="flex flex-col gap-1">
          <label
            htmlFor="otherLink"
            className="text-sm font-medium text-[#170F49] font-poppins"
          >
            Other link (Optional)
          </label>
          <input
            id="otherLink"
            type="url"
            placeholder="www.website/projectname.com"
            {...register("otherLink", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?[a-z0-9.-]+\.[a-z]{2,}.*$/,
                message: "Enter a valid URL",
              },
            })}
            className={`h-12 rounded-xl border-2 pl-4 shadow-md text-sm text-[#6F6C90] font-poppins focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.otherLink ? "border-red-500" : "border-[#f8f8fa]"
            }`}
          />
          {errors.otherLink && (
            <p className="text-red-500 text-xs">{errors.otherLink.message}</p>
          )}
        </div> */}

        {/* Navigation Buttons */}

        <div className="flex justify-between mt-4">
          <IconBtn onClick={handlePrevious} customClasses={`bg-[#c9a4ff]`}>
            Previous Step
          </IconBtn>
          <IconBtn type="submit" customClasses={`px-14 `}>
            {editProject ? "Save and Continue" : "Next"}
          </IconBtn>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetails;
