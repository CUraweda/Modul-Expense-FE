// import React from "react";
import { FaCheck, FaMoneyBill } from "react-icons/fa";
import { useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";
import { formatMoney } from "../utils";
import { ExpenseApi } from "../middleware/restApi.service";
import { FaRectangleList, FaScaleBalanced } from "react-icons/fa6";
import { Store } from "../store/Store";
import { IoMdClose } from "react-icons/io";
import { getExpenses, updateStatusProps } from "../middleware/global.service";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [dataList, setDataList] = useState<any>();
  const [expenses, setExpenses] = useState<any>();
  const [chartData, setChartData] = useState<any>(null);
  const { role, id } = Store();
  useEffect(() => {
    getData();
    getExpense();
  }, []);

  const getData = async () => {
    const { data } = await ExpenseApi.GetValueDashboard();

    if (data?.data?.sumarryMount) {
      setDataList(data?.data);

      setChartData({
        series: [
          {
            name: "Diajukan",
            data: data?.data?.sumarryMount?.totalExpenses || [],
          },
          {
            name: "Disetujui",
            data: data?.data?.sumarryMount?.totalApprovedExpenses || [],
          },
          {
            name: "Ditolak",
            data: data?.data?.sumarryMount?.totalRejectedExpenses || [],
          },
        ],
        options: {
          chart: {
            type: "bar" as const,
            height: 850,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "80%",
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 1,
            colors: ["transparent"],
          },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Des",
            ],
          },
          yaxis: {
            title: {
              text: "total (Rp)",
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: (val: number) => `${formatMoney(val)}`,
            },
          },
        },
      });
    }
  };

  const getExpense = async () => {
    const expenseData = await getExpenses("", "", role, id);

    setExpenses(expenseData.filter((item: any) => item.status === "Pending"));
  };

  const updateStatus = async (id: string | number | null, status: string) => {
    const update = await updateStatusProps(id, status);
    if (update) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      getExpense();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: update,
      });
    }
  };
  return (
    <>
      <div className="w-full p-5">
        <div className="w-full flex flex-wrap gap-3 mt-3">
          <div className="stat w-fit grow bg-base-100 rounded-lg">
            <div className="stat-figure text-primary">
              <FaMoneyBill size={28} />
            </div>
            <div className="stat-title">Total hari ini</div>
            <div className="stat-value text-primary overflow-x-auto overflow-y-hidden">
              {formatMoney(dataList?.totalCostToday)}
            </div>
          </div>
          <div className="stat w-fit grow bg-base-100 rounded-lg">
            <div className="stat-figure text-warning">
              <FaMoneyBill size={28} />
            </div>
            <div className="stat-title">Total bulan ini</div>
            <div className="stat-value text-warning overflow-x-auto overflow-y-hidden">
              {formatMoney(dataList?.totalCostThisMonth)}
            </div>
          </div>
          <div className="stat w-fit grow bg-base-100 rounded-lg">
            <div className="stat-figure text-success">
              <FaRectangleList size={28} />
            </div>
            <div className="stat-title">Total pengajuan bulan ini</div>
            <div className="stat-value text-success overflow-x-auto overflow-y-hidden">
              {dataList?.totalExpenseThisMonth}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="w-full bg-white p-3 rounded-md">
              <div id="chart" className="">
                {chartData ? (
                  <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={350}
                  />
                ) : (
                  <p>Loading chart...</p>
                )}
              </div>
              <div id="html-dist"></div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-base-100 p-3 rounded-lg">
              <h4 className="text-lg font-bold mb-6">Pengajuan Terbaru</h4>
              {expenses?.map((item: any, index: number) => (
                <div key={index}>
                  <div className="px-3 flex w-full justify-between items-center">
                    <div className="flex items-start mb-1 flex-col gap-1 ">
                      <h4 className="text-md font-bold">{item?.name}</h4>
                      <div className="badge badge-success py-3  px-4 text-md text-white font-medium gap-2">
                        <FaMoneyBill />
                        {formatMoney(item?.biaya)}
                      </div>
                    </div>

                    <div className="flex w-full justify-end">
                    <span
                      className={`py-1 px-3 rounded-xl ${
                        item?.status == "Pending"
                          ? "text-yellow-700 bg-yellow-100"
                          : item?.status == "Ditolak"
                          ? "text-red-700 bg-red-100"
                          : "text-green-700 bg-green-100"
                      }`}
                    >
                      {item?.status}
                    </span>
                    </div>
                    <div className="w-full justify-end flex">
                      <button
                        className={`btn btn-sm bg-green-500 text-white font-bold ${
                          role == "2" ? "hidden" : ""
                        }`}
                        onClick={() => updateStatus(item.id, "Disetujui")}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className={`btn btn-sm bg-orange-500 text-white font-bold ${
                          role == "2" ? "hidden" : ""
                        }`}
                        onClick={() => updateStatus(item.id, "Ditolak")}
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  </div>
                  <div className="divider"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
