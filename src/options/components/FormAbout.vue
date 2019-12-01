<template>
  <div class="form-body">

    <div class="row">
      <div class="col s12">
        <h2>Extension Information</h2>
        <p>When you use a button to submit a form, instead of using a input tag, use a button tag with a type submit.</p>
      </div>
      <div class="col s12">

        <p>
          Tristique interdum. Nunc quis mauris dapibus, rutrum tellus in, placerat elit. Ut aliquam nibh arcu, ut
          porttitor nisl malesuada sed. Maecenas est nisl, interdum ac gravida nec, fringilla luctus leo.
          Suspendisse gravida commodo neque. Nam metus odio, volutpat at egestas sagittis, vehicula at purus. Duis
          enim justo, blandit egestas leo a, porttitor cursus magna.
        </p>

        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <colgroup>
              <col class="col-xs-1" />
              <col class="col-xs-7" />
            </colgroup>
            <thead>
              <tr>
                <th>Class</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <code>.active</code>
                </th>
                <td>Applies the hover color to a particular row or cell</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>.success</code>
                </th>
                <td>Indicates a successful or positive action</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>.info</code>
                </th>
                <td>Indicates a neutral informative change or action</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>.warning</code>
                </th>
                <td>Indicates a warning that might need attention</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>.danger</code>
                </th>
                <td>Indicates a dangerous or potentially negative action</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FormAbout'
};
</script>