const body = {
    eid: "IEC120698",
    token: "C9479D1051F34293AEE4B6BB246323",
    device: "<token>C9479D1051F34293AEE4B6BB246323</token>",
    para: "<dt>2023/09/01</dt><rid>117475</rid>",
    tp: 2
};

$modifyRequest({
    body: JSON.stringify(body)
});