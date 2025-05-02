import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../comman/IconBtn";
import { useDispatch, useSelector } from "react-redux";
import { setStep, setProject, setProjectInProgres } from "../../../../slices/projectSlice";
import {
  fetchAllDomains,
  fetchAllTechnology,
} from "../../../../services/operations/projectAPI";
import { toast } from "react-toastify";
const ProjectInfo = () => {

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      domain: "",
      technologies: [],
    },
  });

  const [availableTechnologies, setAvailableTechnologies] = useState([]);
  const [domains, setDomains] = useState([]);
  // const [loading, setLoading] = useState(false);

  const selectedDomain = watch("domain");

  const { project, editProject } = useSelector((state) => state.project);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Fetch domains from API
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const domainsData = await fetchAllDomains(token);
        if (Array.isArray(domainsData)) {
          setDomains(domainsData); // Correctly set domains state
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      } 
    };
    dispatch(setProjectInProgres())
    fetchDomains();
  },[token]); // Ensure token dependency is included


  // Update available technologies based on selected domain
  useEffect(() => {
    if (selectedDomain) {
      console.log("inside fetch tech useEffect");

      const fetchTechnologies = async () => {
        try {
          const technologies = await fetchAllTechnology(selectedDomain, token);
          console.log('->> tech--',technologies);
          
          setAvailableTechnologies(technologies);
          if (editProject && project.domain === selectedDomain) {
            setValue("technologies", project.technologies);
          }
        } catch (error) {
          console.log("Error fetching technologies:", error);
        }
      };
      fetchTechnologies();
    } else {
      setAvailableTechnologies([]);
      setValue("technologies", []); // Reset technologies when domain is cleared
    }

      console.log(availableTechnologies);
  }, [selectedDomain, domains,token,editProject, project.domain, project.technologies, setValue]);


  //set values if editProject is true
  useEffect(() => {
    if (editProject) {
      setValue("title", project.title);
      setValue("domain", project.domain);
      setValue("technologies", project.technologies);
    }
  }, [editProject, project, setValue]);

 const isFormUpdated = () => {
   const currentValues = getValues();
   return (
     currentValues.title !== project.title ||
     currentValues.domain !== project.domain ||
     JSON.stringify(currentValues.technologies) !==
     JSON.stringify(project.technologies)
   );
 };

   const onSubmit = (data) => {
     if (editProject) {
       if (isFormUpdated()) {
          dispatch(setProject({ ...project, ...data }));
          toast.info("Step 2 Completed");
          dispatch(setStep(3));
          toast.success("Project updated successfully");
       } else {
         toast.error("No changes made to the form");
       }
       return;
     }

     dispatch(setProject({ ...project, ...data }));
     toast.info("Step 2 Completed");
     dispatch(setStep(3));
     console.log(data);
     
   };

  return (
    <div className="flex flex-col mt-6">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-semibold text-[#170F49] font-poppins">
          Project
        </h2>
        <p className="mb-4 text-[#6F6C90]">
          Add Necessary Project Information and complete step 1.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        {/* Project Name */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium font-poppins text-[#170F49]"
          >
            Project Name
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ex. Shopping system"
            {...register("title", {
              required: "Project name is required",
              minLength: {
                value: 3,
                message: "Project name must be at least 3 characters",
              },
            })}
            className={`h-12 rounded-lg border-2 ${
              errors.title ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.projectName.message}</p>
          )}
        </div>

        {/* Project Domain */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="domain"
            className="text-sm font-medium font-poppins text-[#170F49]"
          >
            Project Domain
          </label>
          <select
            id="domain"
            {...register("domain", { required: "Project domain is required" })}
            className={`h-12 rounded-lg border-2 ${
              errors.domain ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-[#a3abb9] font-poppins text-sm pl-4`}
          >
            <option value="">Select domain</option>
            { domains && domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
          {errors.domain && (
            <p className="text-red-500 text-xs">{errors.domain.message}</p>
          )}
        </div>

        {/* Technologies */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="technologies"
            className="text-sm font-medium font-poppins text-[#170F49]"
          >
            Technology
          </label>
          <select
            id="technologies"
            multiple
            {...register("technologies", {
              required: "At least one technology must be selected",
            })}
            className={`h-32 rounded-lg border-2 ${
              errors.technologies ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] pl-4 space-y-2 font-poppins`}
          >
            {availableTechnologies &&  availableTechnologies.map((tech, index) => (
              <option key={index} value={tech.name} selected={project.technologies?.includes(tech.name)}>
                {tech.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#6F6C90]">
            Hold Ctrl (Cmd on Mac) to select multiple technologies
          </p>
          {errors.technologies && (
            <p className="text-red-500 text-xs">
              {errors.technologies.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-row-reverse mt-4">
          <IconBtn type="submit" customClasses={`px-14 `}>
            {editProject ? "Save and Continue" : "Next"}
          </IconBtn>
        </div>
      </form>
    </div>
  );
};

export default ProjectInfo;
