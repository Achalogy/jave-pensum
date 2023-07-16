export default ({credits}: {
  credits: number
}) => credits < 10 ? "bg-green-300" : credits < 14 ? "bg-indigo-300" : credits < 18 ? "bg-blue-300" : credits < 20 ? "bg-orange-300" : "bg-red-300"