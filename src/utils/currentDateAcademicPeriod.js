export async function currentDateAcademicPeriod(facultyId) {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${apiUrl}academic-periods/actual-period?facultyId=${facultyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
    }
  );
  const data = await response.json();
  return { status: response.status, data: data };
}
