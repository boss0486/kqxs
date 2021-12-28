 var pageIndex = 1;
 var _urlAction = "/order";
 var URLA = "/backend/order";

 var orderController = {
     init: function() {
         orderController.registerEvent();
     },
     registerEvent: function() {
         $('#btnCreate').off('click').on('click', function() {
             var flg = true;

             if (flg) {
                 orderController.create();
             } else {
                 Notifization.Error(MessageText.Datamissing);
             }
         });
         $('#btnSearch').off('click').on('click', function() {
             orderController.dataList(1);
         });
     },
     dataList: function(page) {
         //
         var ddlTimeExpress = $('#ddlTimeExpress').val();
         var txtStartDate = $('#txtStartDate').val();
         var txtEndDate = $('#txtEndDate').val();
         var ddlArea = $('#ddlArea').val();

         var model = {
             query: $('#txtQuery').val(),
             page: page,
             timeExpress: parseInt(ddlTimeExpress),
             startDate: txtStartDate,
             endDate: txtEndDate,
             timeZoneLocal: LibDateTime.GetTimeZoneByLocal(),
             status: parseInt($('#ddlStatus').val()),
             areaId: ddlArea
         };
         // 

         AjaxFrom.POST({
             url: `${_urlAction}/all`,
             data: model,
             success: function(result) {
                 $('tbody#tblData').html('');
                 $('#pagination').html('');
                 if (result.status == 200) {
                     var currentPage = 1;
                     var pagination = result.paging;
                     if (pagination !== null) {
                         totalPage = pagination.totalPage;
                         currentPage = pagination.currentPage;
                         pageSize = pagination.pageSize;
                         pageIndex = pagination.currentPage;
                     }
                     var rowData = '';
                     $.each(result.data, function(index, item) {
                         index = index + 1;
                         var id = item.id;
                         if (id.length > 0)
                             id = id.trim();
                         //  role 
                         var action = ''; //HelperModel.RolePermission(result.role, "orderController", { id: id, backLink: URLA });
                         //
                         var rowNum = parseInt(index) + (parseInt(currentPage) - 1) * parseInt(pageSize);
                         var _val = "";
                         var _kqxsVal = "";
                         _val = item.value;
                         _kqxsVal = item.kqxsVal;
                         var bg_matched = `bg-danger`;
                         if (item.isMatched) {
                             bg_matched = 'bg-success';
                         }
                         rowData += `<tr>
                            <td class="text-right">${rowNum}&nbsp;</td>
                            <td class='text-center'>${LibDateTime.GetDate(item.buyDate)}</td>                                                                           
                            <td>${item.uuid}</td>                                  
                            <td>${item.bosoName}</td>                                  
                            <td>${item.areaName}</td>                                       
                            <td>${_val}</td>                                       
                            <td>${_kqxsVal}</td>     
                            <td class='text-right'>${item.payAmount} đ</td>     
                            <td class='text-center ${bg_matched}'>${HelperModel.StateIcon(item.isMatched)}</td>      
                       </tr>`;
                     });
                     $('tbody#tblData').html(rowData);
                     if (parseInt(totalPage) > 1) {
                         Paging.Pagination("#pagination", totalPage, currentPage, orderController.dataList);
                     }
                     return;
                 }
             }
         });
     }
 };

 orderController.init();