
function shopping_basket(){
    var count = $('#count_button').val();
    const idx = $('#idx').val();
    const user_id = $('#user_id').val();
    var stock = $('#stock').val();
    stock *=1;
    count *=1;
    if(user_id =="" || user_id==null){
        alert("로그인 없이는 장바구니에 담을 수 없습니다. 로그인 먼저 해주십시오.");
        window.location.reload();
        return;
    }
    if(count>stock){
        alert("남은 재고보다 구매 수량이 많은 경우에 구매할 수 없습니다.");
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
function shopping_buy(name, price){

    let count = $('#count_button').val();     //구매수량
    const idx = $('#idx').val();            //제품코드
    const user_id = $('#user_id').val();
    let stock = $('#stock').val();
    stock *=1;
    count *=1;
    if(user_id =="" || user_id==null){
        alert("로그인 없이는 구매하기 할 수 없습니다. 로그인 먼저 해주십시오.");
        window.location.reload();
        return;
    }
    console.log(count);
    console.log(stock);
    if(count>stock){
        alert("남은 재고보다 구매 수량이 많은 경우에 구매할 수 없습니다.");
        window.location.reload();
        return;
    }

    var result = confirm("구매하시겠습니까?");
    if(result) {
        IMP.init('imp49200152');
        IMP.request_pay({
            pg : 'inicis', // version 1.1.0부터 지원.
            pay_method : 'card',
            merchant_uid : 'merchant_' + new Date().getTime(),
            name : name,
            amount : price*count, //판매 가격
            buyer_email : 'iamport@siot.do',
            buyer_name : '구매자이름',
            buyer_tel : '010-1234-5678',
            buyer_addr : '서울특별시 강남구 삼성동',
            buyer_postcode : '123-456'
        }, function(rsp) {
            if ( rsp.success ) {
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
            else {
                alert("구매하기 실패하였습니다");
                window.location.reload();
                return false;
            }
        });

    }
    else{
        alert("구매하기를 취소하셨습니다.");
        window.location.reload();
    }
}
function reply_write(){
    const idx = $('#idx').val();                //글 번호
    const reply_content = $('#reply_content').val();     //댓글 내용
    const reply_id = $('#reply_id').val();       //답글인 경우
    const user_id = $('#user_id').val();
    const reply_star = $('#reply_star').val();
    console.log('유저'+user_id);
    console.log('답글'+reply_id);
    console.log('글번호'+idx);
    console.log('댓글내용'+reply_content);
    if(user_id =="" || user_id==null){
        alert("로그인 없이는 댓글을 달 수 없습니다. 로그인 먼저 해주십시오.");
        window.location.reload();
        return;
    }
    var result = confirm("작성하시겠습니까?");
    if(result) {
        $.ajax({// 서버로 데이터 전송
            url:'/itemdetail/reply/write/',
            type:'post',
            data:{"reply_content":reply_content, "reply_id":reply_id, "idx":idx, "reply_star":reply_star},
            success: function(data) {
                var sign = JSON.parse(JSON.stringify(data));
                sign = sign.data;

                if(sign == "success") {
                    alert("작성이 완료되였습니다.");
                    window.location.reload();
                    return true;
                }
                else{
                    alert("작성이 실패하였습니다");
                    window.location.reload();
                    return false;
                }
            },
            error:function (data){}
        })
    }
    else{
        alert("작성하기를 취소하셨습니다.");
        window.location.reload();
    }
}

function reply_change(c_id, idx){
    $('#reply_content').attr('placeholder',c_id+'님에 대한 답글을 작성하세요');
    $('#reply_id').val(idx);
    console.log($('#reply_id').val());
}

function buy_check(delivery, idx){

    var result = confirm("변경하시겠습니까?");
    if(result) {
        $.ajax({// 서버로 데이터 전송
            url:'/manage/delivery/change/',
            type:'post',
            data:{"delivery":delivery, "idx":idx},
            success: function(data) {
                var sign = JSON.parse(JSON.stringify(data));
                sign = sign.data;

                if(sign == "success") {
                    alert("변경이 완료되였습니다.");
                    window.location.reload();
                    return true;
                }
                else{
                    alert("변경이 실패하였습니다");
                    window.location.reload();
                    return false;
                }
            },
            error:function (data){}
        })
    }
    else{
        alert("변경하기를 취소하셨습니다.");
        window.location.reload();
    }
}
function change_info(where){
    alert("현재 비밀번호를 입력하세요.");
    var pwd = prompt("현재 비밀번호 입력" + "");
    if(pwd==null){
        alert("취소하셨습니다.");
        window.location.reload();
        return;
    }
    var truefalse = confirm("비밀번호가 맞습니까?");
    if (truefalse) {
        $.ajax({// 서버로 데이터 전송
            url:'/mypage/check/pwd',
            type:'post',
            data:{"pwd":pwd},
            success: function(data) {
                var sign = JSON.parse(JSON.stringify(data));
                sign = sign.data;

                if(sign == "check success") {
                    if(where==1){
                        location.href = "/changedetail";
                    }
                    else{
                        var pwd = prompt("새로운 비밀번호" + "");
                        var pwd2 = prompt("확인 비밀번호"+"");
                        if(pwd!=pwd2){
                            alert("비밀번호가 일치하지 않습니다");
                            window.location.reload();
                            return false;
                        }
                        if(pwd == "" || pwd2=="" || pwd == null || pwd2==null){
                            alert("비밀번호 변경이 실패하였습니다");
                            window.location.reload();
                            return false;
                        }
                        else{
                            $.ajax({// 서버로 데이터 전송
                                url:'/mypage/change/pwd/',
                                type:'post',
                                data:{"pwd":pwd},
                                success: function(data) {
                                    var sign = JSON.parse(JSON.stringify(data));
                                    sign = sign.data;

                                    if(sign == "change success") {
                                        alert("비밀번호 변경이 완료되였습니다.");
                                        window.location.reload();
                                        return true;
                                    }
                                    else{
                                        alert("비밀번호 변경이 실패하였습니다");
                                        window.location.reload();
                                        return false;
                                    }
                                },
                                error:function (data){}
                            })
                        }
                    }
                }
                else{
                    alert("비밀번호가 일치하지 않습니다");
                    window.location.reload();
                    return false;
                }
            },
            error:function (data){}
        })
    } else {
        if(where ==1){
            alert("개인정보 변경하기를 취소하셨습니다.");
            window.location.reload();
        }
        else{
            alert("비밀번호 변경하기를 취소하셨습니다.");
            window.location.reload();
        }
    }
}
function change_detail(){
    var name = $('#detail_name').val();
    var addr = $('#detail_addr').val() + " " + $('#detail_addr2').val();
    var num = $('#detail_num').val();

    var result = confirm("변경하시겠습니까?");
    if(result) {
        $.ajax({// 서버로 데이터 전송
            url:'/changedetail/change/detail_info/',
            type:'post',
            data:{"name":name, "addr":addr, "phone":num},
            success: function(data) {
                var sign = JSON.parse(JSON.stringify(data));
                sign = sign.data;

                if(sign == "success") {
                    alert("변경이 완료되였습니다.");
                    window.location.reload();
                    return true;
                }
                else{
                    alert("변경이 실패하였습니다");
                    window.location.reload();
                    return false;
                }
            },
            error:function (data){}
        })
    }
    else{
        alert("변경하기를 취소하셨습니다.");
        window.location.reload();
    }
}
