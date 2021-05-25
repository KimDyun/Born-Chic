function movetodetail(i_code){
    location.href = "/itemdetail/"+i_code;
}
function shopping_basket(){
    const count = $('#count_button').val();
    const idx = $('#idx').val();
    const user_id = $('#user_id').val();
    if(user_id =="" || user_id==null){
        alert("로그인 없이는 장바구니에 담을 수 없습니다. 로그인 먼저 해주십시오.");
        window.location.reload();
        return;
    }
    var result = confirm("장바구니에 담으시겠습니까?");
    if(result) {
        $.ajax({// 서버로 데이터 전송
            url:'/itemdetail/shopping/cart/'+count+'/'+idx,
            type:'get',
            success: function(data) {
                var sign = JSON.parse(JSON.stringify(data));
                sign = sign.data;

                if(sign == "already shopping cart") {
                    alert("장바구니 담기를 할 수 없습니다. 다시 시도해주십시오.");
                    window.location.reload();
                    return false;
                }
                else if(sign == "success"){
                    alert("장바구니 담기를 완료되었습니다.");
                    window.location.reload();
                    return true;
                }
                else{
                    alert("장바구니 담기 에러가 났습니다");
                    window.location.reload();
                    return false;
                }
            },
            error:function (data){}
        })
    }
    else{
        alert("장바구니에 담기를 취소하셨습니다.");
        window.location.reload();
    }
    console.log(value);
}
function shopping_buy(){
    const count = $('#count_button').val();
    const idx = $('#idx').val();
    const user_id = $('#user_id').val();
    if(user_id =="" || user_id==null){
        alert("로그인 없이는 구매하기 할 수 없습니다. 로그인 먼저 해주십시오.");
        window.location.reload();
        return;
    }
    var result = confirm("구매하시겠습니까?");
    if(result) {
        $.ajax({// 서버로 데이터 전송
            url:'/itemdetail/shopping/buy/'+count+'/'+idx,
            type:'get',
            success: function(data) {
                var sign = JSON.parse(JSON.stringify(data));
                sign = sign.data;

                if(sign == "success") {
                    alert("구매하기 성공하였습니다.");
                    window.location.reload();
                    return true;
                }
                else{
                    alert("구매하기 실패하였습니다");
                    window.location.reload();
                    return false;
                }
            },
            error:function (data){}
        })
    }
    else{
        alert("구매하기를 취소하셨습니다.");
        window.location.reload();
    }
    console.log(value);
}

function reply_change(c_id){
    $('#reply_content').attr('placeholder',c_id+'님에 대한 답글을 작성하세요');
}
function reply_write(c_id){

}
