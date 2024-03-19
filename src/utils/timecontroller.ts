type TimeProblemType = "Feature" | "Now";
type FunctionReturnType = {
  success: boolean;
  Problem?: TimeProblemType;
};

export function timeController(startYear: number, endYear: number, startMonth: number, endMonth: number): FunctionReturnType {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let yearFalseCondition = startYear > endYear;
    let monthFalseCondition = (startYear === endYear && startMonth > endMonth);

    if (yearFalseCondition || monthFalseCondition) {
        return {
            success: false,
            Problem: "Now"
        };
    }

    if (startYear > currentYear || (startYear === currentYear && startMonth > currentMonth)) {
        return {
            success: false,
            Problem: "Feature"
        };
    }

    return {
        success: true
    };
}