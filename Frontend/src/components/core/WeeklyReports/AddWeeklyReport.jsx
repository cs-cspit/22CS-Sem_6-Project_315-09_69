import { useForm } from "react-hook-form";
import IconBtn from "../../comman/IconBtn";
import Loader from "../../comman/Loader"
import { useEffect, useState } from "react";
import { addWeeklyReport } from "../../../services/operations/weeklyReportAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGroupMembers } from "../../../services/operations/groupAPI";

const AddReportForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [studentIds, setStudentIds] = useState([]);
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth);
  const {projectId} = useParams()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addWeeklyReport(projectId, data, token, navigate)
      console.log(data);
    } catch (error) {
      console.log(error); 
      
    }
    setLoading(false)
  };

  const validateDriveLink = (link) => {
    const driveRegex =
      /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing$/;
    return (
      driveRegex.test(link) ||
      "Invalid Google Drive link. Ensure it is publicly accessible."
    );
  };

  useEffect(()=> {
      const getGroupMembers = async () =>{
        setLoading(true);
        try {
            const students = await fetchGroupMembers(projectId, token);
            if(students.count > 0){
              setStudentIds(students.studentIds);
            }
        } catch(error) {
          console.log(error);
        }
        setLoading(false);
      }
      getGroupMembers()
  },[projectId,token,])

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl flex flex-col space-y-6">
      {loading && <Loader />}
      <div>
        <h2 className="text-2xl text-[#170f49] font-poppins font-semibold">
          Weekly Report
        </h2>
        <p className="text-[#6F6C90] font-poppins text-sm mt-2">
          Fill out all Details and click Submit button to submit weekly report
          to your project guide.
        </p>
      </div>

      <div className="w-full h-[1px] bg-[#adb0c6] border shadow-xl"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium font-poppins text-[#443d6d]">
              Week
            </label>
            <input
              type="number"
              placeholder="Week No"
              min={3}
              max={16}
              {...register("weekNumber", {
                required: "Week number is required",
              })}
              className="w-full p-4 font-poppins text-sm text-[#6F8C90] bg-white border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
            {errors.weekNumber && (
              <p className="text-red-500">{errors.weekNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium font-poppins text-[#443d6d]">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full p-4 font-poppins text-sm text-[#6F8C90] bg-white border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
            {errors.startDate && (
              <p className="text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium font-poppins text-[#443d6d]">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="w-full p-4 font-poppins text-sm text-[#6F8C90] bg-white border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
            {errors.endDate && (
              <p className="text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium font-poppins text-[#443d6d]">
            Topic
          </label>
          <textarea
            placeholder="Title"
            {...register("title", { required: "title  is required" })}
            className={` rounded-lg w-full min-h-20 border-2 ${
              errors.title ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4`}
          ></textarea>
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium font-poppins text-[#443d6d]">
            Work done
          </label>
          <textarea
            placeholder="Work done in this week"
            {...register("workDone", { required: "Work done is required" })}
            className={` rounded-lg w-full min-h-20 border-2 ${
              errors.description ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4`}
          ></textarea>
          {errors.workDone && (
            <p className="text-red-500">{errors.workDone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium font-poppins text-[#443d6d]">
            Challenges
          </label>
          <textarea
            placeholder="Challenges"
            {...register("challenges")}
            className={` rounded-lg w-full min-h-20 border-2 ${
              errors.description ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4`}
          ></textarea>
          {errors.challenges && (
            <p className="text-red-500">{errors.workDone.message}</p>
          )}
        </div>

        {studentIds.length > 0 &&
          studentIds.map((memberId, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <label className="block text-sm font-medium font-poppins text-[#443d6d]">
                Individual Work done by Group member {index + 1}
              </label>
              <div className="flex gap-x-12">
                <div>
                  <input
                    type="text"
                    value={memberId}
                    readOnly
                    {...register(`individualWork.${index}.studentId`, {
                      required: "College ID is required",
                    })}
                    className="w-full p-4 font-poppins text-sm text-[#6F8C90] bg-white border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  />
                  {errors?.individualWork?.[index]?.studentId && (
                    <p className="text-red-500">
                      {errors.individualWork[index].studentId.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Work done"
                    {...register(`individualWork.${index}.work`, {
                      required: "Work done is required",
                    })}
                    className="w-full p-4 font-poppins text-sm text-[#6F8C90] bg-white border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  />
                  {errors?.individualWork?.[index]?.work && (
                    <p className="text-red-500">
                      {errors.individualWork[index].work.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

        <div>
          <label className="block text-sm font-medium font-poppins text-[#443d6d]">
            Next Week Work
          </label>
          <textarea
            placeholder="Work for next year"
            {...register("nextWeekWork")}
            className={` rounded-lg w-full min-h-20 border-2 ${
              errors.nextWeekWork ? "border-red-500" : "border-[#f8f8fa]"
            } shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4`}
          ></textarea>
          {errors.nextWeekWork && (
            <p className="text-red-500">{errors.nextWeekWork.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium font-poppins text-[#443d6d]">
            Drive Link
          </label>
          <input
            type="url"
            {...register("attachments", {
              required: "Google Drive link is required",
              validate: validateDriveLink,
            })}
            className="w-full p-4 font-poppins text-sm text-[#6F8C90] bg-white border shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            placeholder="https://drive.google.com/file/d/your-file-id/view?usp=sharing"
          />
          {errors.attachments && (
            <p className="text-red-500">{errors.attachments.message}</p>
          )}
        </div>

        <div className="flex flex-row-reverse">
          <IconBtn onClick={onSubmit}>Save</IconBtn>
        </div>
      </form>
    </div>
  );
};

export default AddReportForm;
