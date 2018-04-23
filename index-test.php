<input type="button" onclick="print()" />打印

<script type="text/javascript">
    function print() {
        var test = "12312312";
        var newwin = window.open("about:blank", "_blank");
        newwin.document.write(test);
        newwin.document.location.reload();
        newwin.print();
        newwin.close();
    }
</script>