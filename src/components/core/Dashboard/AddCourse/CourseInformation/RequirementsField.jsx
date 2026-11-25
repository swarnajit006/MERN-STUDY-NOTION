import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse && course?.instructions) {
      let initialList = course.instructions
      if (typeof initialList === "string") {
        try {
          initialList = JSON.parse(initialList)
        } catch (e) {
          initialList = [initialList]
        }
      }
      if (Array.isArray(initialList)) {
        setRequirementsList(initialList)
      }
    }
    register(name, {
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, requirementsList, {
      shouldValidate: requirementsList.length > 0 || !!errors[name],
      shouldDirty: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList, setValue, name])

  const handleAddRequirement = () => {
    const trimmed = requirement.trim()
    if (trimmed) {
      setRequirementsList((prev) => [...prev, trimmed])
      setRequirement("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddRequirement()
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          placeholder="Enter a requirement and click Add or press Enter"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50 hover:text-yellow-100 transition-all cursor-pointer"
        >
          Add
        </button>
      </div>
      {requirementsList.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {requirementsList.map((reqItem, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded bg-richblack-700 px-3 py-1.5 text-richblack-5 text-sm"
            >
              <div className="flex items-center gap-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-50"></span>
                <span>{reqItem}</span>
              </div>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 hover:text-pink-200 transition-all cursor-pointer"
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
