import React from 'react';

const SubscriptionsPage = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
      <div className="h-[1082px] relative">
        <div className="w-[1640px] h-[101px] px-6 left-0 top-0 absolute bg-white flex-col justify-start items-start inline-flex overflow-hidden">
          <div className="self-stretch grow shrink basis-0 justify-end items-center gap-5 inline-flex">
            <div className="grow shrink basis-0 text-gray-900 text-4xl font-normal font-['Montserrat'] leading-[49.50px]">
              Quản lý Gói
            </div>
          </div>
          <div className="w-[1591px] h-[0px] border border-[#b2b2b2]"></div>
        </div>
        <div className="h-[383px] px-2.5 left-[2px] top-[120px] absolute bg-white rounded-lg flex-col justify-start items-start inline-flex overflow-hidden">
          <div className="self-stretch p-6 justify-start items-center gap-6 inline-flex">
            <div className="grow shrink basis-0 text-[#0a090b] text-xl font-semibold font-['Montserrat']">
              Danh sách các gói
            </div>
            <div className="justify-end items-center gap-[19px] flex">
              <div className="px-5 py-2 bg-[#c0000d] rounded-[5px] flex-col justify-start items-center gap-2 inline-flex">
                <div className="justify-start items-center gap-2 inline-flex">
                  <div className="justify-start items-center gap-2.5 flex overflow-hidden">
                    <div className="text-white text-sm font-semibold font-['Montserrat'] leading-normal">
                      Thêm gói mới
                    </div>
                  </div>
                  <div className="h-5 flex-col justify-center items-center inline-flex">
                    <div className="w-5 h-5 relative flex-col justify-start items-start flex overflow-hidden" />
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-end items-center gap-[19px] flex">
              <div className="px-5 py-2 bg-[#bab8b8] rounded-[5px] flex-col justify-start items-center gap-2 inline-flex">
                <div className="justify-start items-center gap-2 inline-flex">
                  <div className="justify-start items-center gap-2.5 flex overflow-hidden">
                    <div className="text-white text-sm font-semibold font-['Montserrat'] leading-normal">
                      Chỉnh sửa
                    </div>
                  </div>
                  <div className="h-5 flex-col justify-center items-center inline-flex">
                    <div className="w-5 h-5 relative flex-col justify-start items-start flex overflow-hidden" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[39px] h-[39px] bg-[#bab8b8] rounded-[3px] flex-col justify-center items-center inline-flex">
              <div className="w-[57px] h-[57px] p-2 rounded-[48px] justify-center items-center inline-flex">
                <div className="w-6 h-6 justify-center items-center flex">
                  <div className="w-6 h-6 relative"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-[295px] p-6 bg-[#fdfdfd] border-t border-[#f1f1f1] flex-col justify-start items-start gap-6 flex">
            <div className="pl-4 pr-[65px] py-4 bg-[#e7ebef] rounded-[10px] justify-start items-center inline-flex">
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="justify-start items-center flex">
                  <div className="text-[#112a46] text-base font-medium font-['Montserrat']">
                    STT
                  </div>
                </div>
                <div className="relative">
                  <div className="h-[18px] left-0 top-0 absolute justify-start items-center gap-[5px] inline-flex">
                    <div className="text-[#112a46] text-[15px] font-medium font-['Montserrat']">
                      Tên gói
                    </div>
                    <div className="w-3 h-3 relative" />
                  </div>
                </div>
                <div className="justify-start items-center flex">
                  <div className="text-[#112a46] text-base font-medium font-['Montserrat']">
                    Giá
                  </div>
                </div>
                <div className="justify-start items-center flex">
                  <div className="text-[#112a46] text-base font-medium font-['Montserrat']">
                    Thời gian hiệu lực
                  </div>
                </div>
                <div className="justify-start items-center flex">
                  <div className="text-[#112a46] text-base font-medium font-['Montserrat']">
                    Lượng người dùng hiện tại
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[171px] flex-col justify-start items-start flex">
              <div className="self-stretch h-[171px] bg-neutral-50 shadow-[0px_4px_15.300000190734863px_0px_rgba(0,0,0,0.10)] flex-col justify-start items-start gap-px flex">
                <div className="h-[42px] relative bg-white rounded-tl-[5px] rounded-tr-[5px]">
                  <div className="left-[16px] top-[11px] absolute justify-start items-center gap-[22px] inline-flex">
                    <div className="text-[#333333] text-base font-normal font-['Montserrat']">
                      1
                    </div>
                  </div>
                  <div className="left-[300px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    PREMIUM
                  </div>
                  <div className="left-[617px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    20.000 VND
                  </div>
                  <div className="left-[898px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    2 tháng
                  </div>
                  <div className="left-[1291px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    10
                  </div>
                </div>
                <div className="h-[42px] relative bg-white rounded-tl-[5px] rounded-tr-[5px]">
                  <div className="left-[16px] top-[11px] absolute justify-start items-center gap-[22px] inline-flex">
                    <div className="text-[#333333] text-base font-normal font-['Montserrat']">
                      1
                    </div>
                  </div>
                  <div className="left-[300px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    PREMIUM
                  </div>
                  <div className="left-[617px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    20.000 VND
                  </div>
                  <div className="left-[898px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    2 tháng
                  </div>
                  <div className="left-[1291px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    10
                  </div>
                </div>
                <div className="h-[42px] relative bg-white rounded-tl-[5px] rounded-tr-[5px]">
                  <div className="left-[16px] top-[11px] absolute justify-start items-center gap-[22px] inline-flex">
                    <div className="text-[#333333] text-base font-normal font-['Montserrat']">
                      1
                    </div>
                  </div>
                  <div className="left-[300px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    PREMIUM
                  </div>
                  <div className="left-[617px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    20.000 VND
                  </div>
                  <div className="left-[898px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    2 tháng
                  </div>
                  <div className="left-[1291px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    10
                  </div>
                </div>
                <div className="h-[42px] relative bg-white rounded-tl-[5px] rounded-tr-[5px]">
                  <div className="left-[16px] top-[11px] absolute justify-start items-center gap-[22px] inline-flex">
                    <div className="text-[#333333] text-base font-normal font-['Montserrat']">
                      1
                    </div>
                  </div>
                  <div className="left-[300px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    PREMIUM
                  </div>
                  <div className="left-[617px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    20.000 VND
                  </div>
                  <div className="left-[898px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    2 tháng
                  </div>
                  <div className="left-[1291px] top-[11px] absolute text-[#333333] text-base font-normal font-['Montserrat']">
                    10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[157px] left-[1433px] top-[994px] absolute justify-between items-center inline-flex">
          <div className="w-12 h-[46px] px-[9px] py-1.5 bg-neutral-100 rounded border border-[#eeeeee] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="text-[#404b52] text-base font-medium font-['Poppins'] leading-none">
              &lt;
            </div>
          </div>
          <div className="w-[46px] h-[46px] px-2.5 py-1.5 bg-[#15b097] rounded border border-[#15b097] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="text-white text-base font-medium font-['Poppins'] leading-none">
              1
            </div>
          </div>
          <div className="w-12 h-[46px] px-[9px] py-1.5 bg-neutral-100 rounded border border-[#eeeeee] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="text-[#404b52] text-base font-medium font-['Poppins'] leading-none">
              &gt;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
