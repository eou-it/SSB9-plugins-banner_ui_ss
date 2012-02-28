<section class="data-bound-forms">
    <form class="data-bind-form-1">
        <fieldset>
            <legend>Form One</legend>
            <input class="text1" id="text1" />
            <input class="text2" id="text2" />
            <input class="text3" id="text3" />
        </fieldset>
    </form>
    <form class="data-bind-form-2">
        <fieldset>
            <legend>Form Two</legend>
            <span class="text-span1" data-bind="text text1"></span>
            <span class="text-span2" data-bind="text text2"></span>
            <span class="text-span3" data-bind="text text3"></span>
            %{--<input class="text1" />--}%
            %{--<input class="text2" />--}%
            %{--<input class="text3" />--}%
        </fieldset>
    </form>
</section>
